'use strict'

const path = require('path')
const packagePath = path.join(process.cwd(), 'package.json')
const { name, version } = require(packagePath)
const statusRouteSchema = require('./status-routes.schema.json')

function handleStatusRoute(request, reply) {
  reply.type('application/json').code(200)
  reply.send({
    name: this.serviceName,
    status: 'OK',
    version: this.serviceVersion,
  })
}

module.exports = function statusRoutes(fastify, options, next) {
  const { healthinessHandler, readinessHandler } = options.serviceModule

  fastify.decorate('serviceName', process.env.npm_package_name || name) // eslint-disable-line no-process-env
  fastify.decorate('serviceVersion', process.env.npm_package_version || version) // eslint-disable-line no-process-env
  fastify.route({
    method: 'GET',
    url: '/healthz',
    schema: statusRouteSchema,
    handler: healthinessHandler || handleStatusRoute,
  })

  fastify.route({
    method: 'GET',
    url: '/ready',
    schema: statusRouteSchema,
    handler: readinessHandler || handleStatusRoute,
  })

  next()
}
