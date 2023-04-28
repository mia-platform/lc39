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
const serviceModule = require('./modules/correct-module')

test('Launch Fastify for testing', async assert => {
  const fastifyInstance = await launch('./tests/modules/correct-module', {})
  assert.ok(fastifyInstance)

  const serverAddress = fastifyInstance.server.address()
  assert.notOk(serverAddress)
  assert.strictSame(fastifyInstance.log.level, 'info')

  assert.end()
})

test('Launch Fastify for testing, overriding default values', async assert => {
  const fastifyInstance = await launch('./tests/modules/correct-module', {
    logLevel: 'silent',
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

  assert.end()
})

test('Launch Fastify with service module passed as function - options are overwritten by service options', async assert => {
  const swaggerInfo = {
    title: 'Service title',
    description: 'This description of the service functionality',
    version: 'v1.0.0',
  }
  const fastifyInstance = await launch(serviceModule, {
    logLevel: 'silent',
    envVariables: {
      ENV_KEY: 'ENV_VALUE',
    },
    swaggerDefinition: {
      info: swaggerInfo,
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

  const responseDocs = await fastifyInstance.inject({
    method: 'GET',
    url: '/documentation/json',
  })

  assert.strictSame(JSON.parse(responseDocs.payload).info, {
    title: 'Example application',
    description: 'This application is an example for the lc39 functionality',
    version: 'TEST_VERSION',
  })

  assert.end()
})
