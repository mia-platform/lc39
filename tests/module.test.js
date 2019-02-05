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
