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
    routerOptions: {
      ignoreTrailingSlash: false,
      caseSensitive: true,
    },
    // /**
    //  * @deprecated
    //  * The router options for caseSensitive, ignoreTrailingSlash property access is deprecated.
    //  * Please use "options.routerOptions" instead
    //  */
    // caseSensitive: true,
    // /**
    //  * @deprecated
    //  * The router options for caseSensitive, ignoreTrailingSlash property access is deprecated.
    //  * Please use "options.routerOptions" instead
    //  */
    // ignoreTrailingSlash: false,
    // use “legacy” header version with prefixed x- for better compatibility with existing enterprises infrastructures
    requestIdHeader: 'x-request-id',
    // set 30 seconds to
    pluginTimeout: 30000,
    // virtually disable the max body size limit
    bodyLimit: Number.MAX_SAFE_INTEGER,
  }
}

function exportFastifyOptions(/** @type {import('fastify').FastifyServerOptions} options */ moduleOptions) {
  // NOTE: solves deprecation issue of caseSensitive and ignoreTrailingSlash properties in Fastify 5
  // by moving them inside routerOptions, as expected from Fastify@6
  const { caseSensitive, ignoreTrailingSlash } = moduleOptions || {}
  const defaultOptions = defaultFastifyOptions()

  const opts = {
    ...defaultOptions,
    ...moduleOptions,
    routerOptions: {
      ...moduleOptions.routerOptions,
      caseSensitive: caseSensitive || defaultOptions.routerOptions.caseSensitive,
      ignoreTrailingSlash: ignoreTrailingSlash || defaultOptions.routerOptions.ignoreTrailingSlash,
    },
  }

  delete opts.caseSensitive
  delete opts.ignoreTrailingSlash

  return opts
}

function exportServiceOptions(options) {
  const fastifyPluginOptions = {}
  const { prefix, envVariables, validationCompiler } = options

  if (prefix) {
    fastifyPluginOptions.prefix = prefix
  }

  if (validationCompiler) {
    fastifyPluginOptions.validationCompiler = validationCompiler
  }

  Object
    .keys(envVariables || {})
    .forEach(key => { fastifyPluginOptions[key] = envVariables[key] })

  return fastifyPluginOptions
}

module.exports = {
  exportFastifyOptions,
  exportServiceOptions,
}
