'use strict'

module.exports = async function plugin(fastify) {
  fastify.get('/', {
    schema: {
      querystring: {
        type: 'object',
        properties: {
          label: { type: 'string' },
        },
      },
    },
  }, function returnConfig(request, reply) {
    reply.send({ })
  })
}

module.exports.transformSchemaForSwagger = ({ schema, url } = {}) => {
  if (!schema) {
    return {
      url,
      schema: {
        hide: true,
      },
    }
  }
  if (schema.hide) {
    // if a route is set as hidden its schema should not be modified
    return {
      schema,
      url,
    }
  }

  return {
    schema: {
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
    },
    url,
  }
}

module.exports.swaggerDefinition = {
  openApiSpecification: 'swagger',
}
