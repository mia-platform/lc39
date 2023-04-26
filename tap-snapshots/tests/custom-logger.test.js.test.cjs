/* IMPORTANT
 * This snapshot file is auto-generated, but designed for humans.
 * It should be checked into source control and tracked carefully.
 * Re-generate by setting TAP_SNAPSHOT=1 and running tests.
 * Make sure to inspect the output below.  Do not ignore changes!
 */
'use strict'
exports[`tests/custom-logger.test.js TAP Test log serialize error both for error and err fields > must match snapshot 1`] = `
Array [
  Object {
    "err": Object {
      "message": "error with err field",
      "stack": "[redacted stack]",
      "type": "Error",
    },
    "error": Object {
      "message": "error with error field",
      "stack": "[redacted stack]",
      "type": "Error",
    },
  },
]
`

exports[`tests/custom-logger.test.js TAP Test redacted values - uppercase headers > must match snapshot 1`] = `
Array [
  Object {
    "headersToSend": Object {
      "Authorization": "[REDACTED]",
      "Cookie": "[REDACTED]",
    },
  },
]
`

exports[`tests/custom-logger.test.js TAP Test redacted values > must match snapshot 1`] = `
Array [
  Object {
    "headers": Object {
      "authorization": "[REDACTED]",
      "content-length": "71",
      "content-type": "application/json",
      "cookie": "[REDACTED]",
      "host": "localhost:80",
      "user-agent": "lightMyRequest",
    },
    "requestBody": Object {
      "email": "[REDACTED]",
      "password": "[REDACTED]",
      "username": "[REDACTED]",
    },
  },
]
`
