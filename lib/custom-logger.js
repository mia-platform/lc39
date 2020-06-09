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
  return `,"time":${Math.round(Date.now() / 1000.0)}`
}

function pinoOptions(moduleOptions, options) {
  const stream = options.stream ? { stream: options.stream } : {}
  return {
    level: options.logLevel || moduleOptions.logLevel || 'info',
    redact: moduleOptions.redact || defaultRedactionRules(),
    ...stream,
    timestamp: timestampFunction,
  }
}

function logIncomingRequest(req, reply, next) {
  const { req: { method, url }, headers, hostname, ip } = req
  req.log.trace({
    http: {
      request: { method },
    },
    url: { path: url },
    userAgent: {
      original: headers['user-agent'],
    },
    host: {
      hostname,
      ip,
    },
  }, 'incoming request')
  next()
}

function logRequestCompleted(req, reply, next) {
  const { req: { method, url }, headers, hostname, ip } = req
  const { res: { statusCode } } = reply
  req.log.info({
    http: {
      request: { method },
      response: {
        statusCode,
        body: {
          bytes: reply.res.getHeader('content-length'),
        },
      },
    },
    url: { path: url },
    userAgent: {
      original: headers['user-agent'],
    },
    host: {
      hostname,
      ip,
    },
    responseTime: reply.getResponseTime(),
  }, 'request completed')
  next()
}

module.exports = function customLogger(moduleOptions, options) {
  return pinoOptions(moduleOptions, options)
}

module.exports.pinoOptions = pinoOptions
module.exports.logIncomingRequest = logIncomingRequest
module.exports.logRequestCompleted = logRequestCompleted
module.exports.timestampFunction = timestampFunction
