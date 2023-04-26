/*
 * Copyright 2020 Mia srl
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

test('Test Fastify creation with standard metrics', async assert => {
  const options = { logLevel: 'silent' }

  const fastifyInstance = await launch('./tests/modules/correct-module', options)
  assert.teardown(() => fastifyInstance.close())

  const metricsResponse = await fastifyInstance.inject({
    method: 'GET',
    url: '/-/metrics',
  })

  assert.strictSame(metricsResponse.statusCode, 200)
  assert.strictSame(metricsResponse.headers['content-type'], 'text/plain')
  assert.ok(Number(metricsResponse.headers['content-length']) > 10, 'No metrics are exposed')

  assert.end()
})

test('lc39 allow you to create custom metrics', async assert => {
  const options = { logLevel: 'silent' }

  const fastifyInstance = await launch('./tests/modules/custom-metrics', options)
  assert.teardown(() => fastifyInstance.close())

  let response = await fastifyInstance.inject({
    method: 'GET',
    url: '/',
  })
  assert.strictSame(response.statusCode, 200)
  response = await fastifyInstance.inject({
    method: 'GET',
    url: '/?label=my-label',
  })
  assert.strictSame(response.statusCode, 200)

  const metricsResponse = await fastifyInstance.inject({
    method: 'GET',
    url: '/-/metrics',
  })

  assert.strictSame(metricsResponse.statusCode, 200)
  assert.strictSame(metricsResponse.headers['content-type'], 'text/plain')
  assert.ok(Number(metricsResponse.headers['content-length']) > 10, 'No metrics are exposed')

  assert.ok(/custom_metric 1/.test(metricsResponse.body), 'no metric found')
  assert.ok(/custom_metric{label="my-label"} 1/.test(metricsResponse.body), 'no metric found')

  assert.end()
})

test('should not expose /-/metrics if exposeMetrics is false', async assert => {
  const options = { logLevel: 'silent', exposeMetrics: false }

  const fastifyInstance = await launch('./tests/modules/correct-module', options)
  assert.teardown(() => fastifyInstance.close())

  const metricsResponse = await fastifyInstance.inject({
    method: 'GET',
    url: '/-/metrics',
  })

  assert.strictSame(metricsResponse.statusCode, 404)

  assert.end()
})

test('lc39 disable route metrics if passed as options', async assert => {
  const options = { logLevel: 'silent' }

  const fastifyInstance = await launch('./tests/modules/custom-metrics-with-options', options)
  assert.teardown(() => fastifyInstance.close())

  let response = await fastifyInstance.inject({
    method: 'GET',
    url: '/',
  })
  assert.strictSame(response.statusCode, 200)
  response = await fastifyInstance.inject({
    method: 'GET',
    url: '/?label=my-label',
  })
  assert.strictSame(response.statusCode, 200)

  const metricsResponse = await fastifyInstance.inject({
    method: 'GET',
    url: '/-/metrics',
  })

  assert.strictSame(metricsResponse.statusCode, 200)
  assert.strictSame(metricsResponse.headers['content-type'], 'text/plain')
  assert.ok(Number(metricsResponse.headers['content-length']) > 10, 'No metrics are exposed')

  assert.ok(/custom_metric 1/.test(metricsResponse.body), 'no metric found')
  assert.ok(/custom_metric{label="my-label"} 1/.test(metricsResponse.body), 'no metric found')
  assert.notOk(/http_request/.test(metricsResponse.body), 'unexpected metric found')

  assert.end()
})

