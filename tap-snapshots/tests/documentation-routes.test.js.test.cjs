/* IMPORTANT
 * This snapshot file is auto-generated, but designed for humans.
 * It should be checked into source control and tracked carefully.
 * Re-generate by setting TAP_SNAPSHOT=1 and running tests.
 * Make sure to inspect the output below.  Do not ignore changes!
 */
'use strict'
exports[`tests/documentation-routes.test.js > TAP > Test Fastify creation with custom prefix > must match snapshot 1`] = `
Object {
  "components": Object {
    "schemas": Object {
      "def-0": Object {
        "enum": Array [
          "foo",
          "bar",
        ],
        "title": "foobar",
        "type": "string",
      },
    },
  },
  "info": Object {
    "description": "This application is an example for the lc39 functionality",
    "title": "Example application",
    "version": "TEST_VERSION",
  },
  "openapi": "3.0.3",
  "paths": Object {
    "/prefix/": Object {
      "head": Object {
        "responses": Object {
          "200": Object {
            "description": "Default Response",
          },
        },
      },
    },
    "/prefix//": Object {
      "get": Object {
        "responses": Object {
          "200": Object {
            "description": "Default Response",
          },
        },
      },
    },
    "/prefix/empty-content-length": Object {
      "get": Object {
        "responses": Object {
          "200": Object {
            "description": "Default Response",
          },
        },
      },
      "head": Object {
        "responses": Object {
          "200": Object {
            "description": "Default Response",
          },
        },
      },
    },
    "/prefix/error": Object {
      "get": Object {
        "responses": Object {
          "200": Object {
            "description": "Default Response",
          },
        },
      },
      "head": Object {
        "responses": Object {
          "200": Object {
            "description": "Default Response",
          },
        },
      },
    },
    "/prefix/items/{itemId}": Object {
      "get": Object {
        "parameters": Array [
          Object {
            "in": "path",
            "name": "itemId",
            "required": true,
            "schema": Object {
              "type": "string",
            },
          },
        ],
        "responses": Object {
          "200": Object {
            "description": "Default Response",
          },
        },
      },
      "head": Object {
        "parameters": Array [
          Object {
            "in": "path",
            "name": "itemId",
            "required": true,
            "schema": Object {
              "type": "string",
            },
          },
        ],
        "responses": Object {
          "200": Object {
            "description": "Default Response",
          },
        },
      },
      "post": Object {
        "parameters": Array [
          Object {
            "in": "path",
            "name": "itemId",
            "required": true,
            "schema": Object {
              "type": "string",
            },
          },
        ],
        "responses": Object {
          "200": Object {
            "description": "Default Response",
          },
        },
      },
    },
    "/prefix/with-error-logs": Object {
      "get": Object {
        "responses": Object {
          "200": Object {
            "description": "Default Response",
          },
        },
      },
      "head": Object {
        "responses": Object {
          "200": Object {
            "description": "Default Response",
          },
        },
      },
    },
    "/prefix/with-logs": Object {
      "post": Object {
        "responses": Object {
          "200": Object {
            "description": "Default Response",
          },
        },
      },
    },
    "/prefix/with-logs-uppercase": Object {
      "post": Object {
        "responses": Object {
          "200": Object {
            "description": "Default Response",
          },
        },
      },
    },
    "/prefix/with-schema": Object {
      "post": Object {
        "responses": Object {
          "200": Object {
            "content": Object {
              "application/json": Object {
                "schema": Object {
                  "properties": Object {
                    "foobar": Object {
                      "$ref": "#/components/schemas/def-0",
                    },
                  },
                  "type": "object",
                },
              },
            },
            "description": "Default Response",
          },
        },
      },
    },
    "/prefix/wrong-content-length": Object {
      "get": Object {
        "responses": Object {
          "200": Object {
            "description": "Default Response",
          },
        },
      },
      "head": Object {
        "responses": Object {
          "200": Object {
            "description": "Default Response",
          },
        },
      },
    },
  },
}
`

exports[`tests/documentation-routes.test.js > TAP > Test Fastify creation with custom prefix without trailing slash > must match snapshot 1`] = `
Object {
  "components": Object {
    "schemas": Object {
      "def-0": Object {
        "enum": Array [
          "foo",
          "bar",
        ],
        "title": "foobar",
        "type": "string",
      },
    },
  },
  "info": Object {
    "description": "This application is an example for the lc39 functionality",
    "title": "Example application",
    "version": "TEST_VERSION",
  },
  "openapi": "3.0.3",
  "paths": Object {
    "/prefix": Object {
      "head": Object {
        "responses": Object {
          "200": Object {
            "description": "Default Response",
          },
        },
      },
    },
    "/prefix/": Object {
      "get": Object {
        "responses": Object {
          "200": Object {
            "description": "Default Response",
          },
        },
      },
      "head": Object {
        "responses": Object {
          "200": Object {
            "description": "Default Response",
          },
        },
      },
    },
    "/prefix/empty-content-length": Object {
      "get": Object {
        "responses": Object {
          "200": Object {
            "description": "Default Response",
          },
        },
      },
      "head": Object {
        "responses": Object {
          "200": Object {
            "description": "Default Response",
          },
        },
      },
    },
    "/prefix/error": Object {
      "get": Object {
        "responses": Object {
          "200": Object {
            "description": "Default Response",
          },
        },
      },
      "head": Object {
        "responses": Object {
          "200": Object {
            "description": "Default Response",
          },
        },
      },
    },
    "/prefix/items/{itemId}": Object {
      "get": Object {
        "parameters": Array [
          Object {
            "in": "path",
            "name": "itemId",
            "required": true,
            "schema": Object {
              "type": "string",
            },
          },
        ],
        "responses": Object {
          "200": Object {
            "description": "Default Response",
          },
        },
      },
      "head": Object {
        "parameters": Array [
          Object {
            "in": "path",
            "name": "itemId",
            "required": true,
            "schema": Object {
              "type": "string",
            },
          },
        ],
        "responses": Object {
          "200": Object {
            "description": "Default Response",
          },
        },
      },
      "post": Object {
        "parameters": Array [
          Object {
            "in": "path",
            "name": "itemId",
            "required": true,
            "schema": Object {
              "type": "string",
            },
          },
        ],
        "responses": Object {
          "200": Object {
            "description": "Default Response",
          },
        },
      },
    },
    "/prefix/with-error-logs": Object {
      "get": Object {
        "responses": Object {
          "200": Object {
            "description": "Default Response",
          },
        },
      },
      "head": Object {
        "responses": Object {
          "200": Object {
            "description": "Default Response",
          },
        },
      },
    },
    "/prefix/with-logs": Object {
      "post": Object {
        "responses": Object {
          "200": Object {
            "description": "Default Response",
          },
        },
      },
    },
    "/prefix/with-logs-uppercase": Object {
      "post": Object {
        "responses": Object {
          "200": Object {
            "description": "Default Response",
          },
        },
      },
    },
    "/prefix/with-schema": Object {
      "post": Object {
        "responses": Object {
          "200": Object {
            "content": Object {
              "application/json": Object {
                "schema": Object {
                  "properties": Object {
                    "foobar": Object {
                      "$ref": "#/components/schemas/def-0",
                    },
                  },
                  "type": "object",
                },
              },
            },
            "description": "Default Response",
          },
        },
      },
    },
    "/prefix/wrong-content-length": Object {
      "get": Object {
        "responses": Object {
          "200": Object {
            "description": "Default Response",
          },
        },
      },
      "head": Object {
        "responses": Object {
          "200": Object {
            "description": "Default Response",
          },
        },
      },
    },
  },
}
`

exports[`tests/documentation-routes.test.js > TAP > Test Fastify creation with no prefix > must match snapshot 1`] = `
Object {
  "components": Object {
    "schemas": Object {
      "def-0": Object {
        "enum": Array [
          "foo",
          "bar",
        ],
        "title": "foobar",
        "type": "string",
      },
    },
  },
  "info": Object {
    "description": "This application is an example for the lc39 functionality",
    "title": "Example application",
    "version": "TEST_VERSION",
  },
  "openapi": "3.0.3",
  "paths": Object {
    "/": Object {
      "get": Object {
        "responses": Object {
          "200": Object {
            "description": "Default Response",
          },
        },
      },
      "head": Object {
        "responses": Object {
          "200": Object {
            "description": "Default Response",
          },
        },
      },
    },
    "/empty-content-length": Object {
      "get": Object {
        "responses": Object {
          "200": Object {
            "description": "Default Response",
          },
        },
      },
      "head": Object {
        "responses": Object {
          "200": Object {
            "description": "Default Response",
          },
        },
      },
    },
    "/error": Object {
      "get": Object {
        "responses": Object {
          "200": Object {
            "description": "Default Response",
          },
        },
      },
      "head": Object {
        "responses": Object {
          "200": Object {
            "description": "Default Response",
          },
        },
      },
    },
    "/items/{itemId}": Object {
      "get": Object {
        "parameters": Array [
          Object {
            "in": "path",
            "name": "itemId",
            "required": true,
            "schema": Object {
              "type": "string",
            },
          },
        ],
        "responses": Object {
          "200": Object {
            "description": "Default Response",
          },
        },
      },
      "head": Object {
        "parameters": Array [
          Object {
            "in": "path",
            "name": "itemId",
            "required": true,
            "schema": Object {
              "type": "string",
            },
          },
        ],
        "responses": Object {
          "200": Object {
            "description": "Default Response",
          },
        },
      },
      "post": Object {
        "parameters": Array [
          Object {
            "in": "path",
            "name": "itemId",
            "required": true,
            "schema": Object {
              "type": "string",
            },
          },
        ],
        "responses": Object {
          "200": Object {
            "description": "Default Response",
          },
        },
      },
    },
    "/with-error-logs": Object {
      "get": Object {
        "responses": Object {
          "200": Object {
            "description": "Default Response",
          },
        },
      },
      "head": Object {
        "responses": Object {
          "200": Object {
            "description": "Default Response",
          },
        },
      },
    },
    "/with-logs": Object {
      "post": Object {
        "responses": Object {
          "200": Object {
            "description": "Default Response",
          },
        },
      },
    },
    "/with-logs-uppercase": Object {
      "post": Object {
        "responses": Object {
          "200": Object {
            "description": "Default Response",
          },
        },
      },
    },
    "/with-schema": Object {
      "post": Object {
        "responses": Object {
          "200": Object {
            "content": Object {
              "application/json": Object {
                "schema": Object {
                  "properties": Object {
                    "foobar": Object {
                      "$ref": "#/components/schemas/def-0",
                    },
                  },
                  "type": "object",
                },
              },
            },
            "description": "Default Response",
          },
        },
      },
    },
    "/wrong-content-length": Object {
      "get": Object {
        "responses": Object {
          "200": Object {
            "description": "Default Response",
          },
        },
      },
      "head": Object {
        "responses": Object {
          "200": Object {
            "description": "Default Response",
          },
        },
      },
    },
  },
}
`
