'use strict'

const fastifyEnv = require('fastify-env')

const envSchema = {
  type: 'object',
  required: ['TEST_ENV'],
  properties: {
    TEST_ENV: { type: 'string', description: 'a test env variable' },
    OPTIONAL_ENV: { type: 'number', decription: 'a test optional env variable', default: 100 },
  },
  additionalProperties: false,
}

// eslint-disable-next-line require-await
module.exports = async function service(fastify, options) {
  fastify.register(fastifyEnv, { schema: envSchema, data: options })
  fastify.get('/', (request, reply) => {
    reply.type('application/json').code(200)
    reply.send({
      testEnv: fastify.config.TEST_ENV,
      optionalEnv: fastify.config.OPTIONAL_ENV,
    })
  })
}
