'use strict'

const { test } = require('tap')
const launch = require('../lib/launch-fastify')
const packageVersion = require('../package.json').version

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
    version: packageVersion,
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
    version: packageVersion,
  })

  await fastifyInstance.close()
  assert.end()
})

test('Test Fastify creation with custom status routes', async assert => {
  const options = {
    logLevel: 'silent',
    port: 3000,
  }

  // A terrible hack for simulating the project running without npm
  const npmPackageName = process.env.npm_package_name // eslint-disable-line no-process-env
  const npmPackageVersion = process.env.npm_package_version // eslint-disable-line no-process-env
  delete process.env.npm_package_name // eslint-disable-line no-process-env
  delete process.env.npm_package_version // eslint-disable-line no-process-env
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
    version: packageVersion,
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
    version: packageVersion,
  })

  await fastifyInstance.close()
  // Undo the hack
  process.env.npm_package_name = npmPackageName // eslint-disable-line no-process-env
  process.env.npm_package_version = npmPackageVersion // eslint-disable-line no-process-env
  assert.end()
})
