/* istanbul ignore file */

'use strict'

// eslint-disable-next-line require-await
module.exports = async function plugin(fastify, config) {
  fastify.get('/', function returnConfig(request, reply) {
    reply.send({ config })
  })
}

module.exports.options = {
  redact: {
    paths: ['supersecret', 'notread[*].here'],
    censor: '[YOUTRIED]',
  },
  trustProxy: '127.0.0.1',
}
