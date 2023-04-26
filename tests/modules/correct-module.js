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

/* istanbul ignore file */

'use strict'

const { logDefaultRedactionRules } = require('../../lib/custom-logger')

module.exports = async function plugin(fastify, config) {
  fastify.get('/', function returnConfig(request, reply) {
    reply.send({ config })
  })
  fastify.get('/error', function error(request, reply) {
    reply.internalServerError('Custom message')
  })
  fastify.get('/wrong-content-length', function wrongContentLength(request, reply) {
    reply.header('Content-Length', 'InvalidValue')
    reply.send({ hi: 'there' })
  })
  fastify.get('/empty-content-length', function emptyContentLength(request, reply) {
    reply.header('Content-Length', '')
    reply.send({ hi: 'there' })
  })
  fastify.get('/items/:itemId', function emptyContentLength(request, reply) {
    reply.send({ config })
  })
  fastify.post('/items/:itemId', function handler(request, reply) {
    reply.additionalRequestCompletedLogInfo = {
      custom: 'property',
    }

    reply.send({ created: 'true' })
  })

  fastify.addSchema({
    $id: 'foobar',
    type: 'string',
    enum: ['foo', 'bar'],
  })
  fastify.post('/with-schema', {
    schema: {
      response: {
        200: {
          type: 'object',
          properties: {
            foobar: { $ref: 'foobar#' },
          },
        },
      },
    },
  }, async() => {
    return {
      foobar: 'foo',
    }
  })

  fastify.post('/with-logs', function handler(request, reply) {
    this.log.info({ headers: request.headers, requestBody: request.body })
    reply.send({})
  })

  fastify.post('/with-logs-uppercase', function handler(request, reply) {
    const headersToSend = {
      Authorization: 'Bearer my token',
      Cookie: request.headers.cookie,
    }
    this.log.info({ headersToSend })
    reply.send({})
  })

  fastify.get('/with-error-logs', function handler(request, reply) {
    this.log.error({
      // eslint-disable-next-line id-blacklist
      err: new Error('error with err field'),
      error: new Error('error with error field'),
    }, 'error logs')
    reply.send({})
  })
}

const redactionRules = logDefaultRedactionRules()

module.exports.options = {
  redact: {
    paths: ['supersecret', 'notread[*].here', ...redactionRules.paths],
    censor: redactionRules.censor,
  },
  trustProxy: '127.0.0.1',
}
