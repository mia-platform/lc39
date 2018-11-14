'use strict'

const { test } = require('tap')
const customLogger = require('../lib/custom-logger')

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
  })

  assert.end()
})
