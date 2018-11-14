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
  if (options.prefix) {
    fastifyPluginOptions.prefix = options.prefix
  }
  return fastifyPluginOptions
}

module.exports = {
  exportFastifyOptions,
  exportServiceOptions,
}
