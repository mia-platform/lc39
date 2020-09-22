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
const { spawn } = require('child_process')
const split = require('split2')

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

test('Test Fastify creation', async assert => {
  const options = {
    logLevel: 'silent',
    port: 3000,
  }

  const fastifyInstance = await launch('./tests/modules/correct-module', options)
  assert.ok(fastifyInstance)

  const serverAddress = fastifyInstance.server.address()
  assert.strictSame(serverAddress.port, 3000)
  assert.strictSame(serverAddress.address, '0.0.0.0')
  assert.strictSame(fastifyInstance.log.level, options.logLevel)

  fastifyInstance.close(() => {
    assert.end()
  })
})

test('Test Fastify creation without exported options', async assert => {
  const options = {
    logLevel: 'silent',
    port: 3000,
  }

  const fastifyInstance = await launch('./tests/modules/one-param-module', options)
  assert.ok(fastifyInstance)

  const serverAddress = fastifyInstance.server.address()
  assert.strictSame(serverAddress.port, 3000)
  assert.strictSame(serverAddress.address, '0.0.0.0')
  assert.strictSame(fastifyInstance.log.level, options.logLevel)

  fastifyInstance.close(() => {
    assert.end()
  })
})

test('Test Fastify plugin start with prefix', async assert => {
  const options = {
    logLevel: 'silent',
    port: 3000,
    prefix: '/prefix/',
  }

  const fastifyInstance = await launch('./tests/modules/correct-module', options)

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

  fastifyInstance.close(() => {
    assert.end()
  })
})

test('Test fail Fastify creation for invalid options', assert => {
  const badLogLevel = {
    logLevel: 'not-valid-log-value',
  }

  assert.rejects(launch('./tests/modules/correct-module', badLogLevel))

  const badPrefixes = [
    'no-slashes',
    '/no-ending-slash',
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

  for (const badPrefix in badPrefixes) {
    const badOptions = {
      prefix: badPrefix,
    }
    assert.rejects(launch('./tests/modules/correct-module', badOptions))
  }
  assert.end()
})

test('Log level inheriting system', async assert => {
  let fastifyInstance = await launch('./tests/modules/module-with-log', {})
  assert.strictSame(fastifyInstance.log.level, launch.importModule('./tests/modules/module-with-log').options.logLevel)
  await fastifyInstance.close()

  fastifyInstance = await launch('./tests/modules/correct-module', {})
  assert.strictSame(fastifyInstance.log.level, 'info')
  await fastifyInstance.close()
  assert.end()
})

test('Log level inheriting system with a custom setting', async assert => {
  const fastifyInstance = await launch('./tests/modules/module-with-log', {})
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

test('Test custom serializers', async assert => {
  assert.plan(13)
  const stream = split(JSON.parse)

  stream.once('data', () => {
    stream.once('data', line => {
      assert.equal(line.reqId, 1)
      assert.equal(line.level, 10)
      assert.notOk(line.req)
      assert.strictSame(line.http, {
        request: {
          method: 'GET',
          userAgent: { original: 'lightMyRequest' },
        },
      })
      assert.strictSame(line.url, { path: '/' })
      assert.strictSame(line.host, { hostname: 'localhost:80', ip: '127.0.0.1' })

      stream.once('data', secondLine => {
        assert.equal(line.reqId, 1)
        assert.equal(secondLine.level, 30)
        assert.notOk(secondLine.res)
        assert.ok(secondLine.responseTime)
        assert.strictSame(secondLine.http, {
          request: {
            method: 'GET',
            userAgent: { original: 'lightMyRequest' },
          },
          response: {
            statusCode: 200,
            body: { bytes: '13' },
          },
        })
        assert.strictSame(secondLine.url, { path: '/' })
        assert.strictSame(secondLine.host, { hostname: 'localhost:80', ip: '127.0.0.1' })

        assert.end()
      })
    })
  })

  const fastifyInstance = await launch('./tests/modules/correct-module', {
    logLevel: 'trace',
    stream,
  })
  await fastifyInstance.inject({
    method: 'GET',
    url: '/',
  })

  await fastifyInstance.close()
})

test('Current opened connection should continue to work after closing and return "connection: close" header - return503OnClosing: false', assert => {
  assert.plan(5)
  launch('./tests/modules/immediate-close-module', {}).then(
    (fastifyInstance) => {
      const { port } = fastifyInstance.server.address()

      const client = net.createConnection({ port }, () => {
        client.write('GET / HTTP/1.1\r\n\r\n')

        client.once('data', data => {
          assert.match(data.toString(), /Connection:\s*keep-alive/i)
          assert.match(data.toString(), /200 OK/i)

          client.write('GET / HTTP/1.1\r\n\r\n')

          client.once('data', data => {
            assert.match(data.toString(), /Connection:\s*close/i)
            assert.match(data.toString(), /200 OK/i)

            // Test that fastify closes the TCP connection
            client.once('close', () => {
              assert.pass()
            })
          })
        })
      })
    }
  )
})

test('Current opened connection should continue to work after closing and after a timeout should return "connection: close" header - return503OnClosing: false', assert => {
  assert.plan(5)
  launch('./tests/modules/immediate-close-module', {}).then(
    (fastifyInstance) => {
      const { port } = fastifyInstance.server.address()

      const client = net.createConnection({ port }, () => {
        client.write('GET / HTTP/1.1\r\n\r\n')

        client.once('data', data => {
          assert.match(data.toString(), /Connection:\s*keep-alive/i)
          assert.match(data.toString(), /200 OK/i)


          setTimeout(() => {
            client.write('GET / HTTP/1.1\r\n\r\n')

            client.once('data', data => {
              assert.match(data.toString(), /Connection:\s*close/i)
              assert.match(data.toString(), /200 OK/i)

              // Test that fastify closes the TCP connection
              client.once('close', () => {
                assert.pass()
              })
            })
          }, 1000)
        })
      })
    }
  )
})

test('Current opened connection should not accept new incoming connections', assert => {
  launch('./tests/modules/immediate-close-module', {}).then(
    (fastifyInstance) => {
      const { port } = fastifyInstance.server.address()
      const client = net.createConnection({ port }, () => {
        client.write('GET / HTTP/1.1\r\n\r\n')

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

test('should wait at least 1 sec before closing the process', assert => {
  const WAIT_BEFORE_SERVER_CLOSE_SEC = 1
  const child = spawn(
    './bin/cli.js',
    ['tests/modules/correct-module.js'],
    { env: { ...process.env, WAIT_BEFORE_SERVER_CLOSE_SEC } }
  )

  let closedDate = null
  child.on('close', () => {
    closedDate = new Date()
  })

  child.stdout.on('data', () => {
    const killedDate = new Date()
    child.kill('SIGTERM')
    setTimeout(() => {
      assert.ok(closedDate.getTime() - killedDate.getTime() > WAIT_BEFORE_SERVER_CLOSE_SEC * 1000)
      assert.end()
    }, (WAIT_BEFORE_SERVER_CLOSE_SEC * 1000) + 300)
  })
})
