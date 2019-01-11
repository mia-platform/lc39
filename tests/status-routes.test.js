'use strict'

const { test } = require('tap')
const launch = require('../lib/launch-fastify')

test('Test Fastify creation with standard status routes', async assert => {
  const options = {
    logLevel: 'silent',
    port: 3000,
  }

  const fastifyInstance = await launch('./tests/modules/correct-module', options)

  const healthResponse = await fastifyInstance.inject({
    method: 'GET',
    url: '/-/healthz',
  })

  assert.strictSame(healthResponse.statusCode, 200)
  assert.strictSame(healthResponse.headers['content-type'], 'application/json; charset=utf-8')
  assert.strictSame(JSON.parse(healthResponse.payload), {
    name: '@mia-platform/lc39',
    status: 'OK',
  })

  const readyResponse = await fastifyInstance.inject({
    method: 'GET',
    url: '/-/ready',
  })

  assert.strictSame(readyResponse.statusCode, 200)
  assert.strictSame(healthResponse.headers['content-type'], 'application/json; charset=utf-8')
  assert.strictSame(JSON.parse(readyResponse.payload), {
    name: '@mia-platform/lc39',
    status: 'OK',
  })

  await fastifyInstance.close()
  assert.end()
})

test('Test Fastify creation with custom status routes', async assert => {
  const options = {
    logLevel: 'silent',
    port: 3000,
  }

  const fastifyInstance = await launch('./tests/modules/custom-routes', options)

  const healthResponse = await fastifyInstance.inject({
    method: 'GET',
    url: '/-/healthz',
  })

  assert.strictSame(healthResponse.statusCode, 200)
  assert.strictSame(healthResponse.headers['content-type'], 'application/json; charset=utf-8')
  assert.strictSame(JSON.parse(healthResponse.payload), {
    name: 'Override with custom name',
    status: 'OK',
  })

  const readyResponse = await fastifyInstance.inject({
    method: 'GET',
    url: '/-/ready',
  })

  assert.strictSame(readyResponse.statusCode, 503)
  assert.strictSame(healthResponse.headers['content-type'], 'application/json; charset=utf-8')
  assert.strictSame(JSON.parse(readyResponse.payload), {
    name: '@mia-platform/lc39',
    status: 'Not ready to respond',
  })

  await fastifyInstance.close()
  assert.end()
})