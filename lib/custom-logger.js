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

const pino = require('pino')

// Sensible default redaction rules
// all first level properties in object or array of objects
// we don't want to see emails, usernames and passwords even if crypted and/or hashed
function defaultRedactionRules() {
  return {
    paths: [
      'email', '[*].email',
      'password', '[*].password',
      'username', '[*].username',
      'authorization', 'Authorization', '[*].authorization', '[*].Authorization',
      'cookie', 'Cookie', '[*].cookie', '[*].Cookie',
    ],
    censor: '[REDACTED]',
  }
}

function timestampFunction() {
  return `,"time":${Date.now()}`
}

function pinoOptions(moduleOptions) {
  const stream = moduleOptions.stream ? { stream: moduleOptions.stream } : {}
  const customLevels = moduleOptions.logger?.customLevels
  const { logger } = moduleOptions
  return {
    level: moduleOptions.logLevel || 'info',
    redact: moduleOptions.redact || defaultRedactionRules(),
    ...stream,
    timestamp: timestampFunction,
    serializers: {
      error: pino.stdSerializers.err,
    },
    ...(logger && logger),
    ...(customLevels && { customLevels }),
  }
}

function removePort(host) {
  if (!host) {
    return undefined
  }
  const hostname = host.split(':')
  return hostname[0]
}

function logIncomingRequest(req, reply, next) {
  const { method, url, headers, params } = req
  req.log.trace({
    http: {
      request: {
        method,
        userAgent: {
          original: headers['user-agent'],
        },
      },
    },
    url: { path: url, params },
    host: {
      hostname: removePort(headers['host']),
      forwardedHostame: headers['x-forwarded-host'],
      ip: headers['x-forwarded-for'],
    },
  }, 'incoming request')
  next()
}

function logRequestCompleted(req, reply, next) {
  const { method, url, headers, params } = req
  const { statusCode, additionalRequestCompletedLogInfo } = reply
  req.log.info({
    ...additionalRequestCompletedLogInfo,
    http: {
      request: {
        method,
        userAgent: {
          original: headers['user-agent'],
        },
      },
      response: {
        statusCode,
        body: {
          bytes: parseInt(reply.getHeader('content-length'), 10) || undefined,
        },
      },
    },
    url: { path: url, params },
    host: {
      hostname: removePort(headers['host']),
      forwardedHost: headers['x-forwarded-host'],
      ip: headers['x-forwarded-for'],
    },
    responseTime: reply.getResponseTime(),
  }, 'request completed')
  next()
}

module.exports = function customLogger(moduleOptions) {
  return pinoOptions(moduleOptions)
}

module.exports.logDefaultRedactionRules = defaultRedactionRules
module.exports.pinoOptions = pinoOptions
module.exports.logIncomingRequest = logIncomingRequest
module.exports.logRequestCompleted = logRequestCompleted
module.exports.timestampFunction = timestampFunction
