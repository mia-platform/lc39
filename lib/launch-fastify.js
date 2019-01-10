'use strict'

const Fastify = require('fastify')
const absolutePath = require('./absolute-path')
const customLogger = require('./custom-logger')
const importEnv = require('./import-env')
const { exportFastifyOptions, exportServiceOptions } = require('./options-extractors')
const statusRoutes = require('./status-routes')

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

async function launchFastify(file, options, address) {
  importEnv(options.envPath)
  const serviceModule = importModule(file)
  const moduleOptions = serviceModule.options || {}
  validatePrefix(options.prefix)
  validateLogLevel(options.logLevel || moduleOptions.logLevel)

  const logger = customLogger(moduleOptions, options)
  const fastify = new Fastify({ ...exportFastifyOptions(moduleOptions), logger })

  fastify.register(statusRoutes, { serviceModule, prefix: '/-/', logLevel: 'silent' })
  fastify.register(serviceModule, exportServiceOptions(options))
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
  const fastify = await launchFastify(file, { ...options, ...defaultTestOptions }, '127.0.0.1')
  return fastify
}

module.exports.importModule = importModule
