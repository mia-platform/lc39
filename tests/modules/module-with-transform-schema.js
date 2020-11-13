'use strict'

module.exports = async function plugin(fastify) {
  fastify.get('/', {
    schema: {
      querystring: {
        label: { type: 'string' },
      },
    },
  }, function returnConfig(request, reply) {
    reply.send({ })
  })
}

module.exports.transformSchemaForSwagger = (schema) => {
  return {
    ...schema,
    querystring: {
      ...schema.querystring,
      properties: {
        ...schema.querystring.properties,
        label: {
          ...schema.querystring.properties.label,
          description: 'Added with transformSchemaForSwagger',
        },
      },
    },
  }
}
