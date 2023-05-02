import { FastifyContextConfig, FastifyInstance, FastifyReply, FastifyRequest, FastifySchema } from 'fastify'
import { expectType } from 'tsd'
import { PassThrough } from 'stream'

import lc39, {Options} from '../'
import { JSONObject } from '@fastify/swagger'

const options: Options = {}
const serverWithFile = lc39('../tests/modules/correct-module.js', options)

expectType<Promise<FastifyInstance>>(serverWithFile)


async function plugin(fastify: FastifyInstance, config: FastifyContextConfig) {
  fastify.get('/', function returnConfig(request: FastifyRequest, reply: FastifyReply) {
    reply.send({ config })
  })
}

const serverWithModule = lc39(plugin)
expectType<Promise<FastifyInstance>>(serverWithModule)

const logStream = new PassThrough()
const serverWithModuleAndAllOptions = lc39(plugin, {
  envPath: '.env',
  envVariables: {
    VARIABLE_ONE: 'my-env-var'
  },
  logLevel: 'silent',
  port: 3000,
  prefix: '/prefix',
  stream: logStream,
  redact: ['authorization'],
  healthinessHandler: async (fastify) => {
    return {
      statusOK: true
    }
  },
  readinessHandler: async (fastify) => {
    return {
      statusOK: true
    }
  },
  checkUpHandler: async (fastify) => {
    return {
      statusOK: true
    }
  },
  swaggerDefinition: {
    openApiSpecification: 'openapi',
    info: {
      title: 'Title',
      description: 'Description',
      version: 'The version'
    }
  },
  transformSchemaForSwagger: function transformSchemaForSwagger({ schema, url }) {
    return {
      schema: schema as unknown as JSONObject,
      url
    }
  },
  oasRefResolver: {
    clone: false,
    buildLocalReference (json: JSONObject, baseUri, fragment, i): string {
      return json.$id as string || `my-fragment-${i}`
    },
  },
  exposeMetrics: false,
  getMetrics: (prometheusClient) => {
    const myCounter = new prometheusClient.Counter({
      name: 'custom_metric',
      help: 'Custom metric',
    })
    return {
      myCounter,
    }
  },
  metricsOptions: {
    endpoint: '/-/metrics'
  }
})
expectType<Promise<FastifyInstance>>(serverWithModuleAndAllOptions)
