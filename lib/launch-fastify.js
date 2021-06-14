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
const { logIncomingRequest, logRequestCompleted } = require('./custom-logger')
const importEnv = require('./import-env')
const { exportFastifyOptions, exportServiceOptions } = require('./options-extractors')
const statusRoutes = require('./status-routes')
const metricsRoutes = require('./metrics-routes')
const swaggerDefinition = require('./swagger-definition')

const WAIT_BEFORE_SERVER_CLOSE_SEC = parseInt(process.env.WAIT_BEFORE_SERVER_CLOSE_SEC) || 10

const lc39Options = {
  disableRequestLogging: true,
}

function checkAsyncFunction(importedModule) {
  if (importedModule.constructor.name !== 'AsyncFunction') {
    // we expect that all services will export an async function
    throw new Error('The module doesn’t export an async function')
  }
}

function checkParamsLength(importedModule) {
  if (importedModule.length > 2) {
    // we expect that all the services will export a function that will accept at max two arguments:
    // fastify and options
    throw new Error('Init function should contain max 2 arguments')
  }
}

function importModule(filePath) {
  // disable the global require rule for importing the right module from the user given file
  // eslint-disable-next-line global-require
  const importedModule = require(absolutePath(filePath))
  checkAsyncFunction(importedModule)
  checkParamsLength(importedModule)
  return importedModule
}

function isRegexValidated(value, regex) {
  return !value || regex.test(value)
}

// we support only prefixes like /, /singleword/ or /multiple-words-and-numb3rs/
const PREFIX_REGEX = new RegExp('^/((?!-)[a-z0-9-]*(?<!-)/)*$')

function validatePrefix(prefix) {
  const isPrefixValid = isRegexValidated(prefix, PREFIX_REGEX)
  if (!isPrefixValid) {
    throw new Error('Prefix value is not valid')
  }
}

const LOG_LEVEL_REGEX = new RegExp('^(error|warn|info|debug|trace|silent)$')

function validateLogLevel(logLevel) {
  const isLogLevelValid = isRegexValidated(logLevel, LOG_LEVEL_REGEX)
  if (!isLogLevelValid) {
    throw new Error('Log level value is not valid')
  }
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

  const mergedOptions = {
    ...moduleOptions,
    ...lc39Options,
  }

  const logger = customLogger(mergedOptions, options)
  const fastify = fastifyBuilder({ ...exportFastifyOptions(mergedOptions), logger })

  let swaggerSpecification = process.env.SWAGGER_SPECIFICATION || 'openapi'
  swaggerSpecification = swaggerSpecification.toLowerCase()
  const statusLogLevel = logger.level === 'silent' ? logger.level : 'error'
  fastify
    .addHook('onRequest', logIncomingRequest)
    .addHook('onResponse', logRequestCompleted)
    .register(statusRoutes, { serviceModule, prefix: '/-/', logLevel: statusLogLevel })
    .register(fastifySwagger, {
      [swaggerSpecification]: swaggerDefinition(serviceModule.swaggerDefinition, swaggerSpecification),
      exposeRoute: true,
      transform: serviceModule.transformSchemaForSwagger,
    })
    .register(fastifySensible, { errorHandler: mergedOptions.errorHandler })

  if (options.exposeMetrics) {
    fastify.register(fp(metricsRoutes), {
      serviceModule,
      metricsOptions: mergedOptions.metrics,
      logLevel: statusLogLevel,
    })
  }

  fastify
    .after(() => {
      const kPrefixSymbolKey = extractSymbol(fastify)
      fastify[kPrefixSymbolKey] = options.prefix || ''
    })
  fastify.register(fp(serviceModule), exportServiceOptions(options))

  await fastify.ready()
  if (address) {
    await fastify.listen(options.port, address)
  }
  return fastify
}

module.exports = async function launch(file, options) {
  const fastify = await launchFastify(file, options, '0.0.0.0')

  process.on('SIGTERM', () => {
    // Google Kubernetes Engine (GKE) is 10 sec,
    // so the worst case, the iptables rule will
    // be updated 10 seconds later after the pod
    // deletion event arrives
    // https://blog.laputa.io/graceful-shutdown-in-kubernetes-85f1c8d586da

    setTimeout(() => {
      fastify.close()
    }, WAIT_BEFORE_SERVER_CLOSE_SEC * 1000)
  })
  return fastify
}

module.exports.testLaunch = async function testLaunch(file, options) {
  const defaultTestOptions = {
    logLevel: 'silent',
    exposeMetrics: true,
  }

  const mergedOptions = { ...defaultTestOptions, ...options }

  const fastify = await launchFastify(file, mergedOptions)
  return fastify
}

module.exports.importModule = importModule
