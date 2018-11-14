#! /usr/bin/env node

'use strict'

const program = require('commander')
const { version } = require('../package')
const launch = require('../lib/launch-fastify')
require('make-promises-safe')

function parsePort(port) {
  return Number.parseInt(port, 10)
}

program
  .name('lc39')
  .version(version, '-v, --version')
  .arguments('<file>')
  .description('lc39 is the Mia-Platform Node.js service launcher')
  .option('-p, --port <port>', 'the port on which the service will listen', parsePort, 3000)
  .option('-x, --prefix <prefix>', 'the routes prefix to add to the service.')
  .option('-l, --log-level <logLevel>', 'the log level to set')
  .option('-e, --env-path [envFile]', 'the env file path')
  .parse(process.argv)

if (!program.args.length) {
  return program.help()
}

const options = {
  port: program.port,
  prefix: program.prefix,
  logLevel: program.logLevel,
  envPath: program.envPath,
}

launch(program.args[0], options)
