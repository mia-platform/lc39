/* istanbul ignore file */

'use strict'

// eslint-disable-next-line require-await
module.exports = async function plugin(fastify, config) {
  fastify.get('/', function returnConfig(request, reply) {
    reply.send({ config })
  })
}

module.exports.readinessHandler = function readinessHandler(request, reply) {
  reply.code(503)
  reply.send({
    name: this.serviceName,
    status: 'Not ready to respond',
    version: this.serviceVersion,
  })
}

module.exports.healthinessHandler = function healthinessHandler(request, reply) {
  reply.code(200)
  reply.send({
    name: 'Override with custom name',
    status: 'OK',
    version: this.serviceVersion,
  })
}
