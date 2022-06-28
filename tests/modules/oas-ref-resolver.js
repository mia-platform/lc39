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

/* istanbul ignore file */

'use strict'

module.exports = async function plugin(fastify, config) {
  fastify.get('/', function returnConfig(request, reply) {
    reply.send({ config })
  })

  fastify.addSchema({
    $id: 'foobar',
    type: 'string',
    enum: ['foo', 'bar'],
  })
  fastify.post('/with-schema', {
    schema: {
      response: {
        200: {
          type: 'object',
          properties: {
            foobar: { $ref: 'foobar#' },
          },
        },
      },
    },
  }, async() => {
    return {
      foobar: 'foo',
    }
  })
}

module.exports.options = {
  trustProxy: '127.0.0.1',
  oasRefResolver: {
    buildLocalReference(json) {
      return `custom-def-${json.$id}`
    },
  },
}
