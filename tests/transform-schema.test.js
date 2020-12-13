/*
 * Copyright 2020 Mia srl
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

test('transformSchemaForSwagger', async t => {
  const options = {
    logLevel: 'silent',
  }

  const fastifyInstance = await launch('./tests/modules/module-with-transform-schema', options)
  const jsonResponse = await fastifyInstance.inject({
    method: 'GET',
    url: '/documentation/json',
  })

  t.tearDown(() => fastifyInstance.close())

  t.test('should edit the schemas', async t => {
    t.strictSame(jsonResponse.statusCode, 200)
    t.strictSame(jsonResponse.headers['content-type'], 'application/json; charset=utf-8')

    const swagger = jsonResponse.payload.replace(packageJsonVersion, 'VERSION')
    t.strictSame(JSON.parse(swagger), getExpectedSchema())
    t.end()
  })
  t.end()
})

function getExpectedSchema() {
  return {
    'swagger': '2.0',
    'info': {
      'title': '@mia-platform/lc39',
      'description': 'The Mia-Platform Node.js service launcher',
      'version': 'VERSION',
    },
    'consumes': [
      'application/json',
    ],
    'produces': [
      'application/json',
    ],
    'definitions': {},
    'paths': {
      '/': {
        'get': {
          'parameters': [
            {
              'type': 'string',
              'description': 'Added with transformSchemaForSwagger',
              'required': false,
              'name': 'label',
              'in': 'query',
            },
          ],
          'responses': {
            '200': {
              'description': 'Default Response',
            },
          },
        },
      },
    },
  }
}
