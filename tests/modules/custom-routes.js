/* istanbul ignore file */

'use strict'

// eslint-disable-next-line require-await
module.exports = async function plugin(fastify, config) {
  fastify.decorate('customProperty', 'custom-values')
  fastify.get('/', function returnConfig(request, reply) {
    reply.send({ config })
  })
}

module.exports.readinessHandler = function readinessHandler(server) {
  return {
    statusOK: false,
    customProperty: server.customProperty,
  }
}

module.exports.healthinessHandler = function healthinessHandler() {
  return {
    statusOK: true,
    status: 'KO',
    name: 'Override with custom name',
  }
}
