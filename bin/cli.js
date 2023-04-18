#! /usr/bin/env node
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

const instrumentOtel = require('../lib/otel-instrumentation')
const program = require('commander')
const { version } = require('../package')
require('make-promises-safe')

function parsePort(port) {
  return Number.parseInt(port, 10)
}

function parseBoolean(bool) {
  if (!bool || bool === 'false' || bool === '0') {
    return false
  }
  return Boolean(bool)
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
  .option('--expose-metrics <bool>', 'expose /-/metrics', parseBoolean, true)
  .option('--enable-tracing <bool>', 'Enable tracing. This feature is in preview, so new releases may include breaking changes.', parseBoolean, false)
  .parse(process.argv)

if (!program.args.length) {
  return program.help()
}

const sdk = instrumentOtel(program.opts())

require('../lib/launch-fastify')(program.args[0], program.opts(), sdk)
