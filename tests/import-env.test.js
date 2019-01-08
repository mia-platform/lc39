'use strict'
/* eslint-disable no-process-env */

const { test } = require('tap')
const importEnv = require('../lib/import-env')

test('Call import env without a path', assert => {
  const preEnv = Object.keys(process.env)
  importEnv()
  assert.strictSame(Object.keys(process.env), preEnv)
  assert.end()
})

test('Call import env with a path', assert => {
  const preEnvLength = Object.keys(process.env).length
  importEnv('./tests/test.env')
  assert.strictSame(Object.keys(process.env).length, preEnvLength + 2)
  assert.strictSame(process.env.TEST_KEY, 'value')
  assert.strictSame(process.env.TEST_EXPANDED_KEY, 'value_expanded')
  assert.end()
})

/* eslint-enable no-proces-env */
