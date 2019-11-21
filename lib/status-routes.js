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

const path = require('path')
const packagePath = path.join(process.cwd(), 'package.json')
const { name, version } = require(packagePath)
const statusRouteSchema = require('./status-routes.schema.json')
/* istanbul ignore next */
const serviceName = process.env.npm_package_name || name
/* istanbul ignore next */
const serviceVersion = process.env.npm_package_version || version

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

  if (!statusOK) {
    fastify.log.error({ debugInfo: response }, 'Service status is not ok')
  }
  reply.send(response)
}

module.exports = function statusRoutes(fastify, options, next) {
  const { healthinessHandler, readinessHandler, checkUpHandler } = options.serviceModule
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

  fastify.route({
    method: 'GET',
    url: '/check-up',
    schema: statusRouteSchema,
    handler: function handler(request, reply) {
      handleStatusRoute(this, checkUpHandler, request, reply)
    },
  })

  next()
}
