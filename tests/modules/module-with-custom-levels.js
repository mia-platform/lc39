/*
 * Copyright 2024 Mia srl
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

module.exports = async function plugin(fastify) {
  fastify.get('/with-custom-logs', function handler(request, reply) {
    this.log.wow({
      auditInfo: 'wow info',
    }, 'Log wow info')
    this.log.audit({
      auditInfo: 'audit info',
    }, 'Log audit info')
    this.log.success({
      successInfo: 'success info',
    }, 'Log success info')
    reply.send('success')
  })
}

module.exports.options = {
  logger: {
    customLevels: {
      wow: 11,
      audit: 35,
      success: 70,
    } },
}
