/* istanbul ignore file */

'use strict'

// eslint-disable-next-line require-await
module.exports = async function plugin(fastify, config) {
  fastify.get('/', function returnConfig(request, reply) {
    reply.send({ config })
  })
}

module.exports.options = {
  logLevel: 'silent',
}
