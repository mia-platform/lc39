'use strict'

const { test } = require('tap')
const { exportFastifyOptions, exportServiceOptions } = require('../lib/options-extractors')

test('Test Fastify server options generator', assert => {
  const moduleOptions = {
    option1: 'value1',
    option2: 'value2',
  }

  const fastifyOptions = exportFastifyOptions(moduleOptions)
  assert.strictSame({
    ignoreTrailingSlash: false,
    caseSensitive: true,
    requestIdHeader: 'x-request-id',
    pluginTimeout: 30000,
    option1: moduleOptions.option1,
    option2: moduleOptions.option2,
  }, fastifyOptions)

  assert.end()
})

test('Test Fastify server options overwriting', assert => {
  const moduleOptions = {
    ignoreTrailingSlash: true,
    pluginTimeout: 42,
    option1: 'value1',
  }

  const fastifyOptions = exportFastifyOptions(moduleOptions)
  assert.strictSame({
    ignoreTrailingSlash: true,
    caseSensitive: true,
    requestIdHeader: 'x-request-id',
    pluginTimeout: 42,
    option1: moduleOptions.option1,
  }, fastifyOptions)

  assert.end()
})

test('Test module options generator', assert => {
  const prefix = '/prefix'
  const cliOptions = {
    prefix,
    otherOption: 'value',
  }

  const serviceOptions1 = exportServiceOptions(cliOptions)
  assert.strictSame({ prefix }, serviceOptions1)

  const serviceOptions2 = exportServiceOptions({})
  assert.strictSame({}, serviceOptions2)

  assert.end()
})
