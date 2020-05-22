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

const miss = require('mississippi')
const split = require('split2')
const pino = require('pino')

// Sensible default redaction rules
// all first level properties in object or array of objects
// we don't want to see emails, usernames and passwords even if crypted and/or hashed
function defaultRedactionRules() {
  return {
    paths: ['email', 'password', 'username', '[*].email', '[*].password', '[*].username'],
    censor: '[REDACTED]',
  }
}

function timestampFunction() {
  return `,"time":${Date.now() / 1000.0}`
}

function pinoOptions(moduleOptions, options) {
  const stream = options.stream ? { stream: options.stream } : {}
  return {
    level: options.logLevel || moduleOptions.logLevel || 'info',
    redact: moduleOptions.redact || defaultRedactionRules(),
    ...stream,
    serializers: {
      req: requestSerializer,
      res: responseSerializer,
    },
    timestamp: timestampFunction,
  }
}

function requestSerializer(request) {
  return {
    http: {
      request: {
        method: request.method,
      },
    },
    url: {
      full: request.url,
    },
    userAgent: {
      original: request.headers['user-agent'],
    },
    host: {
      hostname: request.hostname,
      ip: request.ip,
    },
  }
}

function responseSerializer(response) {
  return {
    http: {
      response: {
        statusCode: response.statusCode,
        body: {
          bytes: response.getHeader('content-length'),
        },
      },
    },
  }
}

module.exports = function customLogger(moduleOptions, options) {
  const { stream } = options
  const transform = (logLine, enc, next) => {
    const { req, res, ...transformedLog } = JSON.parse(logLine.toString())
    next(null, `${JSON.stringify({
      ...transformedLog,
      ...(req || {}),
      ...(res || {}),
    })}\n`)
  }

  const middleware = split()
  miss.pipe(
    middleware,
    miss.through(transform),
    stream || pino.destination(1),
  )

  return pinoOptions(moduleOptions, {
    ...options,
    stream: middleware,
  })
}

module.exports.pinoOptions = pinoOptions
module.exports.requestSerializer = requestSerializer
module.exports.responseSerializer = responseSerializer
module.exports.timestampFunction = timestampFunction
