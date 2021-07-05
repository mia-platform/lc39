/*
 * Copyright 2019 Mia srl
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
const { name, description, version } = require('../package.json')
const swaggerDefinition = require('../lib/swagger-definition')

test('Test the default returned swagger definition', t => {
  t.test('Default definition without any option', assert => {
    const swagger = swaggerDefinition()

    assert.strictSame(swagger, {
      info: {
        title: name,
        description,
        version,
      },
    })

    assert.end()
  })

  t.test('Default definition for OpenAPI 3', assert => {
    const swagger = swaggerDefinition(undefined, 'openapi')

    assert.strictSame(swagger, {
      info: {
        title: name,
        description,
        version,
      },
    })

    assert.end()
  })

  t.test('Default definition for Swagger 2.0', assert => {
    const swagger = swaggerDefinition(undefined, 'swagger')

    assert.strictSame(swagger, {
      info: {
        title: name,
        description,
        version,
      },
      consumes: ['application/json'],
      produces: ['application/json'],
    })

    assert.end()
  })

  t.end()
})

test('Test the custom returned swagger definition', (assert) => {
  const customDefintion = {
    info: {
      title: 'custom-title',
      description: 'custom description for swagger',
      version: 'v2019.01.01',
    },
  }
  const swagger = swaggerDefinition(customDefintion)
  assert.strictSame(swagger, customDefintion)
  assert.end()
})
