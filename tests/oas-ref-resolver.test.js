/*
 * Copyright 2022 Mia srl
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict'

const { test } = require('tap')

const packageJsonVersion = require('../package.json').version
const launch = require('../lib/launch-fastify')

test('without oasRefResolver', async t => {
  const options = {
    logLevel: 'silent',
  }

  const fastifyInstance = await launch('./tests/modules/correct-module', options)
  const jsonResponse = await fastifyInstance.inject({
    method: 'get',
    url: '/documentation/json',
  })

  t.teardown(() => fastifyInstance.close())

  t.test('contains definition with correct title', async t => {
    t.strictSame(jsonResponse.statusCode, 200)
    t.strictSame(jsonResponse.headers['content-type'], 'application/json; charset=utf-8')

    const swagger = jsonResponse.payload.replace(packageJsonVersion, 'VERSION')
    t.strictSame(JSON.parse(swagger), getExpectedDefaultSchema())
    t.end()
  })
  t.end()
})

test('with oasRefResolver', async t => {
  const options = {
    logLevel: 'silent',
  }

  const fastifyInstance = await launch('./tests/modules/oas-ref-resolver', options)
  const jsonResponse = await fastifyInstance.inject({
    method: 'get',
    url: '/documentation/json',
  })

  t.teardown(() => fastifyInstance.close())

  t.test('contains definition with correct title', async t => {
    t.strictSame(jsonResponse.statusCode, 200)
    t.strictSame(jsonResponse.headers['content-type'], 'application/json; charset=utf-8')

    const swagger = jsonResponse.payload.replace(packageJsonVersion, 'VERSION')
    t.strictSame(JSON.parse(swagger), getExpectedCustomSchema())
    t.end()
  })
  t.end()
})

function getExpectedDefaultSchema() {
  return {
    openapi: '3.0.3',
    info: {
      title: 'Example application',
      description: 'This application is an example for the lc39 functionality',
      version: 'TEST_VERSION',
    },
    components: {
      schemas: {
        'def-0': {
          type: 'string',
          enum: ['foo', 'bar'],
          title: 'foobar',
        },
      },
    },
    paths: {
      '/': {
        get: {
          responses: {
            200: {
              description: 'Default Response',
            },
          },
        },
      },
      '/error': {
        get: {
          responses: {
            200: {
              description: 'Default Response',
            },
          },
        },
      },
      '/wrong-content-length': {
        get: {
          responses: {
            200: {
              description: 'Default Response',
            },
          },
        },
      },
      '/empty-content-length': {
        get: {
          responses: {
            200: {
              description: 'Default Response',
            },
          },
        },
      },
      '/items/{itemId}': {
        get: {
          responses: {
            200: {
              description: 'Default Response',
            },
          },
        },
        'post': {
          responses: {
            200: {
              description: 'Default Response',
            },
          },
        },
      },
      '/with-schema': {
        post: {
          responses: {
            200: {
              description: 'Default Response',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      foobar: {
                        $ref: '#/components/schemas/def-0',
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      '/with-logs': {
        post: {
          responses: {
            200: {
              description: 'Default Response',
            },
          },
        },
      },
      '/with-logs-uppercase': {
        post: {
          responses: {
            200: {
              description: 'Default Response',
            },
          },
        },
      },
      '/with-error-logs': {
        get: {
          responses: {
            200: {
              description: 'Default Response',
            },
          },
        },
      },
    },
  }
}

function getExpectedCustomSchema() {
  return {
    openapi: '3.0.3',
    info: {
      title: '@mia-platform/lc39',
      description: 'The Mia-Platform Node.js service launcher',
      version: 'VERSION',
    },
    components: {
      schemas: {
        'custom-def-foobar': {
          type: 'string',
          enum: ['foo', 'bar'],
        },
      },
    },
    paths: {
      '/': {
        get: {
          responses: {
            200: {
              description: 'Default Response',
            },
          },
        },
      },
      '/with-schema': {
        post: {
          responses: {
            200: {
              description: 'Default Response',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      foobar: {
                        $ref: '#/components/schemas/custom-def-foobar',
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  }
}
