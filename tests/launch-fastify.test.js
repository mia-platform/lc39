'use strict'

const { test } = require('tap')
const launch = require('../lib/launch-fastify')

test('Test throw for wrong exported functions', assert => {
  assert.throws(() => {
    launch.importModule('./tests/modules/sync-module')
  })

  assert.throws(() => {
    launch.importModule('./tests/modules/too-many-params-module')
  })

  assert.end()
})

test('No throw for valid exported functions', assert => {
  assert.doesNotThrow(() => {
    launch.importModule('./tests/modules/correct-module')
  })

  assert.doesNotThrow(() => {
    launch.importModule('./tests/modules/one-param-module')
  })

  assert.end()
})

test('Test Fastify creation', async assert => {
  const options = {
    logLevel: 'silent',
    port: 3000,
  }

  const fastifyInstance = await launch('./tests/modules/correct-module', options)
  assert.ok(fastifyInstance)

  const serverAddress = fastifyInstance.server.address()
  assert.strictSame(serverAddress.port, 3000)
  assert.strictSame(serverAddress.address, '0.0.0.0')
  assert.strictSame(fastifyInstance.log.level, options.logLevel)

  fastifyInstance.close(() => {
    assert.end()
  })
})

test('Test Fastify creation without exported options', async assert => {
  const options = {
    logLevel: 'silent',
    port: 3000,
  }

  const fastifyInstance = await launch('./tests/modules/one-param-module', options)
  assert.ok(fastifyInstance)

  const serverAddress = fastifyInstance.server.address()
  assert.strictSame(serverAddress.port, 3000)
  assert.strictSame(serverAddress.address, '0.0.0.0')
  assert.strictSame(fastifyInstance.log.level, options.logLevel)

  fastifyInstance.close(() => {
    assert.end()
  })
})

test('Test Fastify plugin start with prefix', async assert => {
  const options = {
    logLevel: 'silent',
    port: 3000,
    prefix: '/prefix/',
  }

  const fastifyInstance = await launch('./tests/modules/correct-module', options)

  const response = await fastifyInstance.inject({
    method: 'GET',
    url: options.prefix,
  })

  assert.strictSame(response.statusCode, 200)
  assert.strictSame(JSON.parse(response.payload), {
    config: {
      prefix: options.prefix,
    },
  })

  fastifyInstance.close(() => {
    assert.end()
  })
})

test('Test fail Fastify creation for invalid options', assert => {
  const badLogLevel = {
    logLevel: 'not-valid-log-value',
  }

  assert.rejects(launch('./tests/modules/correct-module', badLogLevel))

  const badPrefixes = [
    'no-slashes',
    '/no-ending-slash',
    'no-starting-slash/',
    '/-',
    '/-/',
    '/-invalid-begin/',
    '/invalid-end-/',
    '/invalidUppercase/',
    '/invalid-$pecial-character/',
    '/invalid/multipath-/',
    '/invalid-/multipath/',
    '/invalid/-/multipath/',
  ]

  // eslint-disable-next-line guard-for-in
  for (const badPrefix in badPrefixes) {
    const badOptions = {
      prefix: badPrefix,
    }
    assert.rejects(launch('./tests/modules/correct-module', badOptions))
  }
  assert.end()
})

test('Log level inheriting system', async assert => {
  let fastifyInstance = await launch('./tests/modules/module-with-log', {})
  assert.strictSame(fastifyInstance.log.level, launch.importModule('./tests/modules/module-with-log').options.logLevel)
  await fastifyInstance.close()

  fastifyInstance = await launch('./tests/modules/correct-module', {})
  assert.strictSame(fastifyInstance.log.level, 'info')
  await fastifyInstance.close()
  assert.end()
})
