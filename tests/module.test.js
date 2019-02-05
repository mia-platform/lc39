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
const launch = require('../index')

test('Launch Fastify for testing', async assert => {
  const fastifyInstance = await launch('./tests/modules/correct-module', {})
  assert.ok(fastifyInstance)

  const serverAddress = fastifyInstance.server.address()
  assert.strictSame(serverAddress.port, 3000)
  assert.strictSame(serverAddress.address, '127.0.0.1')
  assert.strictSame(fastifyInstance.log.level, 'silent')

  await fastifyInstance.close()
  assert.end()
})

test('Launch Fastify for testing, overriding default values', async assert => {
  const fastifyInstance = await launch('./tests/modules/correct-module', {
    logLevel: 'silent',
    port: 9000,
    envVariables: {
      ENV_KEY: 'ENV_VALUE',
    },
  })

  const response = await fastifyInstance.inject({
    method: 'GET',
    url: '/',
  })

  assert.strictSame(JSON.parse(response.payload), {
    config: {
      ENV_KEY: 'ENV_VALUE',
    },
  })

  await fastifyInstance.close()
  assert.end()
})
