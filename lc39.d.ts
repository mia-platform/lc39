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

import { LogLevel, FastifyInstance, FastifyPluginAsync, FastifyServerOptions, RouteHandler, FastifyRequest, FastifyReply } from 'fastify'
import { DestinationStream, LoggerOptions, LogFn, LevelWithSilentOrString } from 'pino'
import { FastifyDynamicSwaggerOptions } from '@fastify/swagger'
import prometheusClient, { Metric } from 'prom-client'
import { IMetricsPluginOptions } from 'fastify-metrics'

type StatusHandlerResponse = Record<string, unknown> & {statusOK?: boolean}
type StatusHandler = (fastify: FastifyInstance) => Promise<StatusHandlerResponse>

type SwaggerDefinition = {
  openApiSpecification?: 'openapi' | 'swagger'
} & FastifyDynamicSwaggerOptions['openapi'] & FastifyDynamicSwaggerOptions['swagger']

export interface Options extends FastifyServerOptions {
  envVariables?: Record<string, string>
  envPath?: string
  logLevel?: LogLevel | 'silent'
  port?: number
  prefix?: string
  stream?: DestinationStream
  redact?: LoggerOptions['redact']
  healthinessHandler?: StatusHandler
  readinessHandler?: StatusHandler
  checkUpHandler?: StatusHandler
  swaggerDefinition?: SwaggerDefinition
  transformSchemaForSwagger?: FastifyDynamicSwaggerOptions['transform']
  oasRefResolver?: FastifyDynamicSwaggerOptions['refResolver']
  exposeMetrics?: boolean
  getMetrics?: (client: typeof prometheusClient) => Record<string, Metric>
  metricsOptions?: Partial<IMetricsPluginOptions>
  customLevels?: Record<string, number>
}

declare function lc39(filePathOrServiceModule: string | FastifyPluginAsync, options?: Options): Promise<FastifyInstance>

declare module 'fastify' {
  export interface FastifyBaseLogger {
    [level: string] : LogFn | LevelWithSilentOrString
  }
}

export default lc39
