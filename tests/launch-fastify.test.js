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
const launch = require('../lib/launch-fastify')
const net = require('net')
const split = require('split2')
const SwaggerParser = require('swagger-parser')

function waitForLogLine(stream, predicate) {
  return new Promise(resolve => {
    function onData(line) {
      if (!predicate(line)) {
        return
      }
      stream.off('data', onData)
      resolve(line)
    }

    stream.on('data', onData)
  })
}

test('Test throw for wrong exported functions', assert => {
  assert.throws(() => {
    launch.importModule('./tests/modules/sync-module')
  })

  assert.throws(() => {
    launch.importModule('./tests/modules/too-many-params-module')
  })

  assert.end()
})

test('No throw for valid exported functions', assert => {
  assert.doesNotThrow(() => {
    launch.importModule('./tests/modules/correct-module')
  })

  assert.doesNotThrow(() => {
    launch.importModule('./tests/modules/one-param-module')
  })

  assert.end()
})

test('Test Fastify creation', async t => {
  t.test('Expose OpenAPI 3 specification by default', async assert => {
    const options = {
      logLevel: 'silent',
      port: 3000,
    }

    const fastifyInstance = await launch('./tests/modules/correct-module', options)
    assert.teardown(() => fastifyInstance.close())
    assert.ok(fastifyInstance)

    const serverAddress = fastifyInstance.server.address()
    assert.strictSame(serverAddress.port, 3000)
    assert.strictSame(serverAddress.address, '0.0.0.0')
    assert.strictSame(fastifyInstance.log.level, options.logLevel)

    const response = await fastifyInstance.inject('/documentation/json')
    const payload = JSON.parse(response.payload)
    assert.ok(payload.openapi)

    await SwaggerParser.validate(payload)

    assert.end()
  })

  t.test('Expose Swagger 2.0 specification', async assert => {
    const options = {
      logLevel: 'silent',
      port: 3000,
    }

    const fastifyInstance = await launch('./tests/modules/correct-module-swagger', options)
    assert.teardown(() => fastifyInstance.close())
    assert.ok(fastifyInstance)

    const serverAddress = fastifyInstance.server.address()
    assert.strictSame(serverAddress.port, 3000)
    assert.strictSame(serverAddress.address, '0.0.0.0')
    assert.strictSame(fastifyInstance.log.level, options.logLevel)

    const response = await fastifyInstance.inject('/documentation/json')
    const payload = JSON.parse(response.payload)
    assert.ok(payload.swagger)

    await SwaggerParser.validate(payload)

    assert.end()
  })

  t.end()
})

test('Test Fastify creation without exported options', async assert => {
  const options = {
    logLevel: 'silent',
    port: 3000,
  }

  const fastifyInstance = await launch('./tests/modules/one-param-module', options)
  assert.teardown(() => fastifyInstance.close())
  assert.ok(fastifyInstance)

  const serverAddress = fastifyInstance.server.address()
  assert.strictSame(serverAddress.port, 3000)
  assert.strictSame(serverAddress.address, '0.0.0.0')
  assert.strictSame(fastifyInstance.log.level, options.logLevel)

  assert.end()
})

test('Test Fastify plugin start with prefix', async assert => {
  const options = {
    logLevel: 'silent',
    port: 3000,
    prefix: '/prefix/',
  }

  const fastifyInstance = await launch('./tests/modules/correct-module', options)
  assert.teardown(() => fastifyInstance.close())

  const response = await fastifyInstance.inject({
    method: 'GET',
    url: options.prefix,
  })

  assert.strictSame(response.statusCode, 200)
  assert.strictSame(JSON.parse(response.payload), {
    config: {
      prefix: options.prefix,
    },
  })

  assert.end()
})

test('Test fail Fastify creation for invalid options', async assert => {
  const badLogLevel = {
    logLevel: 'not-valid-log-value',
  }

  assert.rejects(launch('./tests/modules/correct-module', badLogLevel))

  const badPrefixes = [
    'no-slashes',
    'no-starting-slash/',
    '/-',
    '/-/',
    '/-invalid-begin/',
    '/invalid-end-/',
    '/invalidUppercase/',
    '/invalid-$pecial-character/',
    '/invalid/multipath-/',
    '/invalid-/multipath/',
    '/invalid/-/multipath/',
  ]

  for (const badPrefix of badPrefixes) {
    const badOptions = { prefix: badPrefix, logLevel: 'silent' }
    assert.rejects(launch('./tests/modules/correct-module', badOptions), {
      name: 'Error',
      message: 'Prefix value is not valid',
    }, badPrefix)
  }

  const goodPrefixes = [
    '',
    undefined,
    0,
    '/',
    '/singleword/',
    '/multiple-words-and-numb3rs/',
    '/singleword',
    '/multiple-words-and-numb3rs',
  ]
  for (const goodPrefix of goodPrefixes) {
    const goodOptions = { prefix: goodPrefix, logLevel: 'silent' }
    const fastifyInstance = await launch('./tests/modules/correct-module', goodOptions)
    assert.ok(fastifyInstance)
    await fastifyInstance.close()
  }
  assert.end()
})

test('Log level inheriting system', async assert => {
  const stream = split(JSON.parse)
  let fastifyInstance = await launch('./tests/modules/module-with-log', {
    stream,
  })
  assert.strictSame(fastifyInstance.log.level, launch.importModule('./tests/modules/module-with-log').options.logLevel)
  await fastifyInstance.close()

  fastifyInstance = await launch('./tests/modules/correct-module', {
    stream,
  })
  assert.strictSame(fastifyInstance.log.level, 'info')
  await fastifyInstance.close()
  assert.end()
})

test('Log level inheriting system with a custom setting', async assert => {
  const stream = split(JSON.parse)
  const fastifyInstance = await launch('./tests/modules/module-with-log', {
    stream,
  })
  assert.strictSame(fastifyInstance.log.level, launch.importModule('./tests/modules/module-with-log').options.logLevel)
  await fastifyInstance.close()
  assert.end()
})

test('Log level inheriting system with defaults checking data are properly streamed', async assert => {
  const stream = split(JSON.parse)
  const fastifyInstance = await launch('./tests/modules/correct-module', {
    stream,
  })
  assert.strictSame(fastifyInstance.log.level, 'info')
  stream.once('data', line => {
    assert.ok(line)
  })
  await fastifyInstance.close()
  assert.end()
})

test('Test custom serializers', t => {
  t.test('fields values', async assert => {
    assert.plan(13)
    const stream = split(JSON.parse)

    const incomingRequestLogPromise = waitForLogLine(
      stream,
      line => line.reqId === '34' && line.level === 10 && line.http?.request?.method === 'GET'
    )
    const requestCompletedLogPromise = waitForLogLine(
      stream,
      line => line.reqId === '34' && line.level === 30 && line.http?.response?.statusCode === 200
    )

    const fastifyInstance = await launch('./tests/modules/correct-module', {
      logLevel: 'trace',
      stream,
    })
    await fastifyInstance.inject({
      method: 'GET',
      url: '/',
      headers: {
        'x-forwarded-for': 'testIp',
        'host': 'testHost:3000',
        'x-forwarded-host': 'testForwardedHost',
        'x-request-id': '34',
      },
    })

    const incomingRequestLog = await incomingRequestLogPromise
    assert.equal(incomingRequestLog.reqId, '34')
    assert.equal(incomingRequestLog.level, 10)
    assert.notOk(incomingRequestLog.req)
    assert.strictSame(incomingRequestLog.http, {
      request: {
        method: 'GET',
        userAgent: { original: 'lightMyRequest' },
      },
    })
    assert.strictSame(incomingRequestLog.url, { path: '/', params: {} })
    assert.strictSame(incomingRequestLog.host, { hostname: 'testHost', forwardedHostame: 'testForwardedHost', ip: 'testIp' })

    const requestCompletedLog = await requestCompletedLogPromise
    assert.equal(incomingRequestLog.reqId, '34')
    assert.equal(requestCompletedLog.level, 30)
    assert.notOk(requestCompletedLog.res)
    assert.ok(requestCompletedLog.responseTime)
    assert.strictSame(requestCompletedLog.http, {
      request: {
        method: 'GET',
        userAgent: { original: 'lightMyRequest' },
      },
      response: {
        statusCode: 200,
        body: { bytes: 13 },
      },
    })
    assert.strictSame(requestCompletedLog.url, { path: '/', params: {} })
    assert.strictSame(requestCompletedLog.host, { hostname: 'testHost', forwardedHost: 'testForwardedHost', ip: 'testIp' })

    await fastifyInstance.close()
    assert.end()
  })

  t.test('fields values - path with params', async assert => {
    assert.plan(13)
    const stream = split(JSON.parse)

    const incomingRequestLogPromise = waitForLogLine(
      stream,
      line => line.reqId === '34' && line.level === 10 && line.http?.request?.method === 'GET' && line.url?.path === '/items/my-item'
    )
    const requestCompletedLogPromise = waitForLogLine(
      stream,
      line => line.reqId === '34' && line.level === 30 && line.http?.response?.statusCode === 200 && line.url?.path === '/items/my-item'
    )

    const fastifyInstance = await launch('./tests/modules/correct-module', {
      logLevel: 'trace',
      stream,
    })
    await fastifyInstance.inject({
      method: 'GET',
      url: '/items/my-item',
      headers: {
        'x-forwarded-for': 'testIp',
        'host': 'testHost:3000',
        'x-forwarded-host': 'testForwardedHost',
        'x-request-id': '34',
      },
    })

    const incomingRequestLog = await incomingRequestLogPromise
    assert.equal(incomingRequestLog.reqId, '34')
    assert.equal(incomingRequestLog.level, 10)
    assert.notOk(incomingRequestLog.req)
    assert.strictSame(incomingRequestLog.http, {
      request: {
        method: 'GET',
        userAgent: { original: 'lightMyRequest' },
      },
    })
    assert.strictSame(incomingRequestLog.url, { path: '/items/my-item', params: { itemId: 'my-item' } })
    assert.strictSame(incomingRequestLog.host, { hostname: 'testHost', forwardedHostame: 'testForwardedHost', ip: 'testIp' })

    const requestCompletedLog = await requestCompletedLogPromise
    assert.equal(incomingRequestLog.reqId, '34')
    assert.equal(requestCompletedLog.level, 30)
    assert.notOk(requestCompletedLog.res)
    assert.ok(requestCompletedLog.responseTime)
    assert.strictSame(requestCompletedLog.http, {
      request: {
        method: 'GET',
        userAgent: { original: 'lightMyRequest' },
      },
      response: {
        statusCode: 200,
        body: { bytes: 13 },
      },
    })
    assert.strictSame(requestCompletedLog.url, { path: '/items/my-item', params: { itemId: 'my-item' } })
    assert.strictSame(requestCompletedLog.host, { hostname: 'testHost', forwardedHost: 'testForwardedHost', ip: 'testIp' })

    await fastifyInstance.close()
    assert.end()
  })

  t.end()
})

test('Current opened connection should continue to work after closing and return "connection: close" header - return503OnClosing: false', assert => {
  assert.plan(9)
  launch('./tests/modules/immediate-close-module', { logLevel: 'trace' }).then(
    async(fastifyInstance) => {
      const { port } = fastifyInstance.server.address()

      const client2 = net.createConnection({ port, host: '127.0.0.1' }, () => {
        client2.write('GET / HTTP/1.1\r\nHost: 127.0.0.1\r\n\r\n')
        client2.once('data', data => {
          assert.match(data.toString(), /Connection:\s*keep-alive/i)
          assert.match(data.toString(), /200 OK/i)
          assert.match(data.toString(), /\{"path":"\/"}/i)

          client2.write('GET / HTTP/1.1\r\nHost: 127.0.0.1\r\n\r\n')
          client2.once('data', data => {
            assert.match(data.toString(), /Connection:\s*close/i)
            assert.match(data.toString(), /200 OK/i)

            // Test that fastify closes the TCP connection
            client2.once('close', () => {
              assert.pass()
            })
          })
        })
      })

      const client1 = net.createConnection({ port, host: '127.0.0.1' }, () => {
        client1.write('GET /close HTTP/1.1\r\nHost: 127.0.0.1\r\n\r\n')

        client1.once('data', data => {
          assert.match(data.toString(), /Connection:\s*keep-alive/i)
          assert.match(data.toString(), /200 OK/i)

          // Test that fastify closes the TCP connection
          client1.once('close', () => {
            assert.pass()
          })
        })
      })
    }
  )
})

test('Current opened connection should continue to work after closing and after a timeout should return "connection: close" header - return503OnClosing: false', assert => {
  assert.plan(9)
  launch('./tests/modules/immediate-close-module', {}).then(
    (fastifyInstance) => {
      const { port } = fastifyInstance.server.address()

      const client2 = net.createConnection({ port, host: '127.0.0.1' }, () => {
        client2.write('GET / HTTP/1.1\r\nHost: 127.0.0.1\r\n\r\n')
        client2.once('data', data => {
          assert.match(data.toString(), /Connection:\s*keep-alive/i)
          assert.match(data.toString(), /200 OK/i)
          assert.match(data.toString(), /\{"path":"\/"}/i)

          setTimeout(() => {
            client2.write('GET / HTTP/1.1\r\nHost: 127.0.0.1\r\n\r\n')
            client2.once('data', data => {
              assert.match(data.toString(), /Connection:\s*close/i)
              assert.match(data.toString(), /200 OK/i)

              // Test that fastify closes the TCP connection
              client2.once('close', () => {
                assert.pass()
              })
            })
          }, 1000)
        })
      })

      const client1 = net.createConnection({ port, host: '127.0.0.1' }, () => {
        client1.write('GET /close HTTP/1.1\r\nHost: 127.0.0.1\r\n\r\n')

        client1.once('data', data => {
          assert.match(data.toString(), /Connection:\s*keep-alive/i)
          assert.match(data.toString(), /200 OK/i)

          // Test that fastify closes the TCP connection
          client1.once('close', () => {
            assert.pass()
          })
        })
      })
    }
  )
})

test('Current idle connection close after server close "connection: close" header - return503OnClosing: false', assert => {
  assert.plan(3)
  launch('./tests/modules/immediate-close-module', {}).then(
    (fastifyInstance) => {
      const { port } = fastifyInstance.server.address()

      const client = net.createConnection({ port, host: '127.0.0.1' }, () => {
        client.write('GET /close HTTP/1.1\r\nHost: 127.0.0.1\r\n\r\n')

        client.once('data', data => {
          assert.match(data.toString(), /Connection:\s*keep-alive/i)
          assert.match(data.toString(), /200 OK/i)

          // Test that fastify force close of the TCP connection
          client.once('close', () => {
            assert.pass()
          })
        })
      })
    }
  )
})

test('Current opened connection should not accept new incoming connections', assert => {
  launch('./tests/modules/immediate-close-module', {}).then(
    (fastifyInstance) => {
      const { port } = fastifyInstance.server.address()
      const client = net.createConnection({ port, host: '127.0.0.1' }, () => {
        client.write('GET /close HTTP/1.1\r\nHost: 127.0.0.1\r\n\r\n')

        const newConnection = net.createConnection({ port })
        newConnection.on('error', error => {
          assert.ok(error)
          assert.ok(['ECONNREFUSED', 'ECONNRESET'].includes(error.code))

          client.end()
          assert.end()
        })
      })
    }
  )
})

test('path with and without trailing slash', async assert => {
  const options = {
    logLevel: 'silent',
  }

  const fastifyInstance = await launch('./tests/modules/correct-module', options)
  assert.teardown(() => fastifyInstance.close())

  const response1 = await fastifyInstance.inject({
    method: 'GET',
    url: '/items/my-item',
  })

  assert.strictSame(response1.statusCode, 200)

  const response2 = await fastifyInstance.inject({
    method: 'GET',
    url: '/items/my-item/',
  })

  assert.strictSame(response2.statusCode, 404)

  assert.end()
})

test('should use correctly the logger with custom levels', async assert => {
  const fastifyInstance = await launch('./tests/modules/module-with-custom-levels', {})
  assert.teardown(() => fastifyInstance.close())

  const response = await fastifyInstance.inject({
    method: 'GET',
    url: '/with-custom-logs',
  })

  assert.strictSame(response.statusCode, 200)

  assert.end()
})

test('should use correctly logger custom hooks', async assert => {
  const fastifyInstance = await launch('./tests/modules/custom-hooks', {})
  assert.teardown(() => fastifyInstance.close())

  const response = await fastifyInstance.inject({
    method: 'POST',
    url: '/custom-hooks',
  })

  assert.strictSame(response.statusCode, 200)
  assert.end()
})
