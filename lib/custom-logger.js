'use strict'

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

function pinoOptions(moduleOptions, options) {
  return {
    level: options.logLevel || moduleOptions.logLevel || 'info',
    redact: moduleOptions.redact || defaultRedactionRules(),
  }
}

module.exports = function customLogger(moduleOptions, options) {
  return pino(pinoOptions(moduleOptions, options))
}

module.exports.pinoOptions = pinoOptions
