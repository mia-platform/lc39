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

const { test } = require('tap')
const { launch } = require('../lib/launch-fastify')

// This is a trivial test, but is useful to see if the fastify incapsulation
// has not been broken by accident
test('Test correct import for the fastify sensible plugin', async assert => {
  const options = {
    logLevel: 'silent',
  }

  const fastifyInstance = await launch('./tests/modules/correct-module', options)
  assert.ok(fastifyInstance.httpErrors)
  assert.ok(fastifyInstance.assert)
  assert.end()
})

test('Test default error handling', async assert => {
  const options = {
    logLevel: 'silent',
  }

  const fastifyInstance = await launch('./tests/modules/correct-module', options)
  const response = await fastifyInstance.inject({
    method: 'GET',
    url: '/error',
  })

  assert.strictSame(500, response.statusCode)
  assert.strictSame(JSON.parse(response.payload), {
    statusCode: 500,
    message: 'Custom message',
    error: 'Internal Server Error',
  })

  assert.end()
})

test('Test custom error handling', async assert => {
  const options = {
    logLevel: 'silent',
  }

  const fastifyInstance = await launch('./tests/modules/custom-error-handler', options)

  const response = await fastifyInstance.inject({
    method: 'GET',
    url: '/error',
  })

  assert.strictSame(500, response.statusCode)
  assert.strictSame(JSON.parse(response.payload), {
    statusCode: 500,
    message: 'Custom error message',
    error: 'Internal Server Error',
  })

  assert.end()
})
