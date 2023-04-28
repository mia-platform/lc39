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
const launch = require('../lib/launch-fastify')

test('Test Fastify creation with no prefix', async assert => {
  const options = {
    logLevel: 'silent',
  }

  const fastifyInstance = await launch('./tests/modules/correct-module', options)

  const jsonResponse = await fastifyInstance.inject({
    method: 'GET',
    url: '/documentation/json',
  })

  assert.strictSame(jsonResponse.statusCode, 200)
  assert.strictSame(jsonResponse.headers['content-type'], 'application/json; charset=utf-8')

  const textResponse = await fastifyInstance.inject({
    method: 'GET',
    url: '/documentation/static/index.html',
  })

  assert.strictSame(textResponse.statusCode, 200)
  assert.strictSame(textResponse.headers['content-type'], 'text/html; charset=UTF-8')
  assert.matchSnapshot(JSON.parse(jsonResponse.body))

  const { statusCode } = await fastifyInstance.inject({
    method: 'GET',
    url: '/',
  })
  assert.strictSame(statusCode, 200)

  await fastifyInstance.close()
  assert.end()
})

test('Test Fastify creation with custom prefix', async assert => {
  const options = {
    prefix: '/prefix/',
    logLevel: 'silent',
  }

  const fastifyInstance = await launch('./tests/modules/correct-module', options)

  const jsonResponse = await fastifyInstance.inject({
    method: 'GET',
    url: '/documentation/json',
  })

  assert.strictSame(jsonResponse.statusCode, 200)
  assert.matchSnapshot(JSON.parse(jsonResponse.body))

  const { statusCode } = await fastifyInstance.inject({
    method: 'GET',
    url: '/prefix/',
  })
  assert.strictSame(statusCode, 200)

  await fastifyInstance.close()
  assert.end()
})

test('Test Fastify creation with custom prefix without trailing slash', async assert => {
  const options = {
    prefix: '/prefix',
    logLevel: 'silent',
  }

  const fastifyInstance = await launch('./tests/modules/correct-module', options)

  const jsonResponse = await fastifyInstance.inject({
    method: 'GET',
    url: '/documentation/json',
  })

  assert.strictSame(jsonResponse.statusCode, 200)
  assert.matchSnapshot(JSON.parse(jsonResponse.body))

  const { statusCode } = await fastifyInstance.inject({
    method: 'GET',
    url: '/prefix/',
  })
  assert.strictSame(statusCode, 200)

  await fastifyInstance.close()
  assert.end()
})
