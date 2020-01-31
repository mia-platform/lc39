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

// Very opinionated default options for the Fastify server instance
function defaultFastifyOptions() {
  return {
    return503OnClosing: false,
    ignoreTrailingSlash: false,
    caseSensitive: true,
    // use “legacy” header version with prefixed x- for better compatibility with existing enterprises infrastructures
    requestIdHeader: 'x-request-id',
    // set 30 seconds to
    pluginTimeout: 30000,
    // virtually disable the max body size limit
    bodyLimit: Number.MAX_SAFE_INTEGER,
  }
}

function exportFastifyOptions(moduleOptions) {
  return { ...defaultFastifyOptions(), ...moduleOptions }
}

function exportServiceOptions(options) {
  const fastifyPluginOptions = {}
  const { prefix, envVariables } = options

  if (prefix) {
    fastifyPluginOptions.prefix = prefix
  }

  if (envVariables) {
    for (const key in envVariables) {
      if ({}.hasOwnProperty.call(envVariables, key)) {
        fastifyPluginOptions[key] = envVariables[key]
      }
    }
  }

  return fastifyPluginOptions
}

module.exports = {
  exportFastifyOptions,
  exportServiceOptions,
}
