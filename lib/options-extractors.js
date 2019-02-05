'use strict'

// Very opinionated default options for the Fastify server instance
function defaultFastifyOptions() {
  return {
    ignoreTrailingSlash: false,
    caseSensitive: true,
    // use “legacy” header version with prefixed x- for better compatibility with existing enterprises infrastructures
    requestIdHeader: 'x-request-id',
    // set 30 seconds to
    pluginTimeout: 30000,
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
      if (Object.hasOwnProperty.call(envVariables, key)) {
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
