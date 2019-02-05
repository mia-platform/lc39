'use strict'

const path = require('path')
const packagePath = path.join(process.cwd(), 'package.json')
const { name, version } = require(packagePath)
const statusRouteSchema = require('./status-routes.schema.json')
/* istanbul ignore next */
const serviceName = process.env.npm_package_name || name // eslint-disable-line no-process-env
/* istanbul ignore next */
const serviceVersion = process.env.npm_package_version || version // eslint-disable-line no-process-env

async function handleStatusRoute(fastify, userHandler, request, reply) {
  let statusResponse = {
    statusOK: true,
    name: serviceName,
    version: serviceVersion,
  }
  if (userHandler) {
    const userOverride = await userHandler(fastify)
    statusResponse = {
      ...statusResponse,
      ...userOverride,
    }
  }

  const { statusOK } = statusResponse
  delete statusResponse.statusOK
  delete statusResponse.status

  const responseCode = statusOK ? 200 : 503
  reply.type('application/json').code(responseCode)

  const response = {
    status: statusOK ? 'OK' : 'KO',
    ...statusResponse,
  }
  reply.send(response)
}

module.exports = function statusRoutes(fastify, options, next) {
  const { healthinessHandler, readinessHandler } = options.serviceModule
  fastify.route({
    method: 'GET',
    url: '/healthz',
    schema: statusRouteSchema,
    handler: function handler(request, reply) {
      handleStatusRoute(this, healthinessHandler, request, reply)
    },
  })

  fastify.route({
    method: 'GET',
    url: '/ready',
    schema: statusRouteSchema,
    handler: function handler(request, reply) {
      handleStatusRoute(this, readinessHandler, request, reply)
    },
  })

  next()
}
