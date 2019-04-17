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
const { exportFastifyOptions, exportServiceOptions } = require('../lib/options-extractors')

test('Test Fastify server options generator', assert => {
  const moduleOptions = {
    option1: 'value1',
    option2: 'value2',
    bodyLimit: 1073742000,
  }

  const fastifyOptions = exportFastifyOptions(moduleOptions)
  assert.strictSame({
    ignoreTrailingSlash: false,
    caseSensitive: true,
    requestIdHeader: 'x-request-id',
    pluginTimeout: 30000,
    bodyLimit: moduleOptions.bodyLimit,
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
    bodyLimit: Number.MAX_SAFE_INTEGER,
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
