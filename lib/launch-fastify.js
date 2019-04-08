/*
 * Copyright 2019 Mia srl
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict'

const fastifyBuilder = require('fastify')
const fp = require('fastify-plugin')
const fastifySwagger = require('fastify-swagger')
const fastifySensible = require('fastify-sensible')
const absolutePath = require('./absolute-path')
const customLogger = require('./custom-logger')
const importEnv = require('./import-env')
const { exportFastifyOptions, exportServiceOptions } = require('./options-extractors')
const statusRoutes = require('./status-routes')
const swaggerDefinition = require('./swagger-definition')

function importModule(filePath) {
  // disable the global require rule for importing the right module from the user given file
  // eslint-disable-next-line global-require
  const module = require(absolutePath(filePath))

  if (module.constructor.name !== 'AsyncFunction') {
    // we expect that all services will export an async function
    throw new Error('The module doesn’t export an async function')
  }

  if (module.length > 2) {
    // we expect that all the services will export a function that will accept at max two arguments:
    // fastify and options
    throw new Error('Init function should contain max 2 arguments')
  }
  return module
}

function validatePrefix(prefix) {
  if (!prefix) {
    return
  }
  // we support only prefixes like /, /singleword/ or /multiple-words-and-numb3rs/
  const regex = new RegExp('^/((?!-)[a-z0-9-]*(?<!-)/)*$')
  if (regex.test(prefix)) {
    return
  }
  throw new Error('Prefix value is not valid')
}

function validateLogLevel(logLevel) {
  if (!logLevel) {
    return
  }
  // we will check if the value pass in logLevel is one of the values accepted by pino.js
  const regex = new RegExp('^(error|warn|info|debug|trace|silent)$')
  if (regex.test(logLevel)) {
    return
  }
  throw new Error('Log level value is not valid')
}

// Hack for exposing some routes without prefix but sharing the same context
function extractSymbol(fastify) {
  const fastifySymbols = Object.getOwnPropertySymbols(fastify)
  return fastifySymbols.filter(symbol => symbol.toString() === 'Symbol(fastify.routePrefix)')[0]
}

async function launchFastify(file, options, address) {
  importEnv(options.envPath)
  const serviceModule = importModule(file)
  const moduleOptions = serviceModule.options || {}
  validatePrefix(options.prefix)
  validateLogLevel(options.logLevel || moduleOptions.logLevel)

  const logger = customLogger(moduleOptions, options)
  const fastify = fastifyBuilder({ ...exportFastifyOptions(moduleOptions), logger })

  fastify
    .register(statusRoutes, { serviceModule, prefix: '/-/', logLevel: 'silent' })
    .register(fastifySwagger, {
      swagger: swaggerDefinition(serviceModule.swaggerDefinition),
      exposeRoute: true,
    })
    .register(fastifySensible)
    .after(() => {
      const kPrefixSymbolKey = extractSymbol(fastify)
      fastify[kPrefixSymbolKey] = options.prefix || ''
    })
  fastify.register(fp(serviceModule), exportServiceOptions(options))
  await fastify.listen(options.port, address)

  return fastify
}

module.exports = async function launch(file, options) {
  const fastify = await launchFastify(file, options, '0.0.0.0')
  return fastify
}

module.exports.testLaunch = async function testLaunch(file, options) {
  const defaultTestOptions = {
    port: 3000,
    logLevel: 'silent',
  }

  const mergedOptions = { ...defaultTestOptions, ...options }

  const fastify = await launchFastify(file, mergedOptions, '127.0.0.1')
  return fastify
}

module.exports.importModule = importModule
