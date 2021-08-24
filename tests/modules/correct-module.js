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
}

module.exports.options = {
  redact: {
    paths: ['supersecret', 'notread[*].here'],
    censor: '[YOUTRIED]',
  },
  trustProxy: '127.0.0.1',
}
