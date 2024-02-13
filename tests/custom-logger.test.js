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
const { PassThrough } = require('stream')
const pino = require('pino')
const customLogger = require('../lib/custom-logger')
const { timestampFunction, logDefaultRedactionRules } = require('../lib/custom-logger')
const launch = require('../lib/launch-fastify')

test('Test generation for custom logger', assert => {
  const options = {
    logLevel: 'info',
  }

  const logger = customLogger(options)
  assert.ok(logger)

  assert.end()
})

test('Test generation custom logger default options', assert => {
  const options = {
    unusedKey: 'unusedValue',
    imHere: 'butImNotReturned',
  }

  const pinoOptions = customLogger.pinoOptions(options)
  assert.strictSame(pinoOptions, {
    level: 'info',
    redact: logDefaultRedactionRules(),
    timestamp: timestampFunction,
    serializers: {
      error: pino.stdSerializers.err,
    },
  })

  assert.end()
})

test('Test generation custom logger custom options', assert => {
  const options = {
    redact: {
      censor: '[BRACE YOURSELF, GDPR IS COMING]',
      paths: [
        'veryPrivate',
        'suchIntresting.[*].howToHide',
      ],
    },
    logLevel: 'debug',
    customLogLevel: 'audit',
  }

  const pinoOptions = customLogger.pinoOptions(options)
  assert.strictSame(pinoOptions, {
    level: options.logLevel,
    redact: options.redact,
    timestamp: timestampFunction,
    serializers: {
      error: pino.stdSerializers.err,
    },
    customLevels: {
      audit: 35,
    },
  })

  assert.end()
})

test('Test timestamp generation in milliseconds', assert => {
  const recentYear = 2021
  const [, timestampString] = timestampFunction().split(':')
  const dateFromTimestamp = new Date(parseInt(timestampString, 10))

  assert.ok(dateFromTimestamp.getFullYear() >= recentYear)

  assert.end()
})

test('Test redacted values', async assert => {
  const data = []
  const logStream = new PassThrough()
    .on('data', (streamData) => {
      data.push(Buffer.from(streamData, 'utf8').toString())
    })

  const options = {
    logLevel: 'trace',
    port: 3002,
    stream: logStream,
  }
  const fastifyInstance = await launch('./tests/modules/correct-module', options)
  assert.ok(fastifyInstance)

  await fastifyInstance.inject({
    method: 'POST',
    url: `/with-logs`,
    headers: {
      authorization: '1234567890',
      cookie: 'sid=1234567890',
    },
    payload: {
      username: 'username',
      password: 'password',
      email: 'email@email.com',
    },
  })


  await fastifyInstance.close()
  const logs = data.reduce((acc, log) => {
    const parseLog = JSON.parse(log)
    const pickedValues = { headers: parseLog.headers, requestBody: parseLog.requestBody }
    if (!pickedValues.headers || !pickedValues.requestBody) {
      return acc
    }
    return [...acc, pickedValues]
  }, [])

  assert.matchSnapshot(logs)
  assert.end()
})

test('Test redacted values - uppercase headers', async assert => {
  const data = []
  const logStream = new PassThrough()
    .on('data', (streamData) => {
      data.push(Buffer.from(streamData, 'utf8').toString())
    })

  const options = {
    logLevel: 'trace',
    port: 3002,
    stream: logStream,
  }
  const fastifyInstance = await launch('./tests/modules/correct-module', options)
  assert.ok(fastifyInstance)

  await fastifyInstance.inject({
    method: 'POST',
    url: `/with-logs-uppercase`,
    headers: {
      authorization: '1234567890',
      cookie: 'sid=1234567890',
    },
    payload: {
      username: 'username',
      password: 'password',
      email: 'email@email.com',
    },
  })

  await fastifyInstance.close()
  const logs = data.reduce((acc, log) => {
    const parseLog = JSON.parse(log)
    const pickedValues = { headersToSend: parseLog.headersToSend }
    if (!pickedValues.headersToSend) {
      return acc
    }
    return [...acc, pickedValues]
  }, [])

  assert.matchSnapshot(logs)
  assert.end()
})

test('Test log serialize error both for error and err fields', async assert => {
  const data = []
  const logStream = new PassThrough()
    .on('data', (streamData) => {
      data.push(Buffer.from(streamData, 'utf8').toString())
    })

  const options = {
    logLevel: 'trace',
    port: 3002,
    stream: logStream,
  }
  const fastifyInstance = await launch('./tests/modules/correct-module', options)
  assert.ok(fastifyInstance)

  await fastifyInstance.inject({
    method: 'GET',
    url: `/with-error-logs`,
  })

  await fastifyInstance.close()
  const logs = data.reduce((acc, log) => {
    const parseLog = JSON.parse(log)
    if (parseLog.msg !== 'error logs') {
      return acc
    }
    // assert.ok(parseLog.err.stack)
    // assert.ok(parseLog.error.stack)
    const pickedValues = {
      // eslint-disable-next-line id-blacklist
      err: {
        ...parseLog.err,
        stack: '[redacted stack]',
      },
      error: {
        ...parseLog.error,
        stack: '[redacted stack]',
      },
    }
    return [...acc, pickedValues]
  }, [])

  assert.matchSnapshot(logs)
  assert.end()
})

test('Test log with custom audit level', async assert => {
  const data = []
  const logStream = new PassThrough()
    .on('data', (streamData) => {
      data.push(Buffer.from(streamData, 'utf8').toString())
    })

  const options = {
    logLevel: 'trace',
    port: 3002,
    stream: logStream,
    customLogLevel: 'audit',
  }
  const fastifyInstance = await launch('./tests/modules/correct-module', options)
  assert.ok(fastifyInstance)

  const { payload, statusCode } = await fastifyInstance.inject({
    method: 'GET',
    url: `/with-audit-logs`,
  })
  await fastifyInstance.close()

  assert.strictSame(statusCode, 200)
  assert.strictSame(payload, 'success')
  assert.end()
})
