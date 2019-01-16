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

module.exports.readinessHandler = function readinessHandler(fastify) {
  const response = {
    statusOK: true,
  }

  if (fastify.config.OPTIONAL_ENV <= 100) {
    response.statusOK = false
    response.message = `Service is not ready, because the we have only ${fastify.config.OPTIONAL_ENV} points`
  }

  return response
}

// eslint-disable-next-line no-unused-vars
module.exports.healthinessHandler = function healthinessHandler(fastify) {
  return {
    statusOK: true,
  }
}
