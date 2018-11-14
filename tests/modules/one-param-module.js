/* istanbul ignore file */

'use strict'

// eslint-disable-next-line require-await
module.exports = async function plugin(fastify) {
  fastify.get('/', function returnConfig(request, reply) {
    reply.send({ })
  })
}
