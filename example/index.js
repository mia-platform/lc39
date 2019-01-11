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

module.exports.readinessHandler = function readinessHandler(request, reply) {
  let code = 200
  const response = {
    name: this.serviceName,
    status: 'OK',
    version: this.serviceVersion,
  }

  if (this.config.OPTIONAL_ENV <= 100) {
    code = 503
    response.status = `Service is not ready, because the we have only ${this.config.OPTIONAL_ENV} points`
  }
  reply.code(code)
  reply.send(response)
}

module.exports.healthinessHandler = function healthinessHandler(request, reply) {
  reply.code(200)
  reply.send({
    name: 'everything-is-awesome',
    status: 'OK',
    // avoid to set the version because it will not be read
  })
}
