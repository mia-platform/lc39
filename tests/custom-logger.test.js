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
const customLogger = require('../lib/custom-logger')
const { timestampFunction } = require('../lib/custom-logger')

test('Test generation for custom logger', assert => {
  const moduleOptions = {}
  const options = {
    logLevel: 'info',
  }

  const logger = customLogger(moduleOptions, options)
  assert.ok(logger)

  assert.end()
})

test('Test generation custom logger default options', assert => {
  const moduleOptions = {
    unusedKey: 'unusedValue',
  }
  const options = {
    imHere: 'butImNotReturned',
  }

  const pinoOptions = customLogger.pinoOptions(moduleOptions, options)
  assert.strictSame(pinoOptions, {
    level: 'info',
    redact: {
      censor: '[REDACTED]',
      paths: [
        'email',
        'password',
        'username',
        '[*].email',
        '[*].password',
        '[*].username',
      ],
    },
    timestamp: timestampFunction,
  })

  assert.end()
})

test('Test generation custom logger default options', assert => {
  const options = {
    logLevel: 'debug',
    redact: 'ignoredValue',
  }
  const moduleOptions = {
    redact: {
      censor: '[BRACE YOURSELF, GDPR IS COMING]',
      paths: [
        'veryPrivate',
        'suchIntresting.[*].howToHide',
      ],
    },
    logLevel: 'overwritten',
  }

  const pinoOptions = customLogger.pinoOptions(moduleOptions, options)
  assert.strictSame(pinoOptions, {
    level: options.logLevel,
    redact: moduleOptions.redact,
    timestamp: timestampFunction,
  })

  assert.end()
})

test('Test timestamp generation in milliseconds', assert => {
  const [, timestampString] = timestampFunction().split(':')
  const millisecondTimestampMagnitude = 1e12

  assert.ok(parseInt(timestampString, 10) > millisecondTimestampMagnitude)

  assert.end()
})
