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

import { LogLevel, FastifyInstance } from 'fastify'

// declare namespace lc39 {

//   interface environmentSchema {
//     type: 'object',
//     required?: string[],
//     properties: object
//   }

//   interface launchOptions {
//     prefix?: string,
//     logLevel?: LogLevel,
//     envVariables?: lc39.environmentSchema,
//   }

// }

interface environmentSchema {
  type: 'object',
  required?: string[],
  properties: object
}

interface launchOptions {
  prefix?: string,
  logLevel?: LogLevel,
  envVariables?: environmentSchema,
}

declare function lc39(filePath:string, options: launchOptions): FastifyInstance

export default lc39
