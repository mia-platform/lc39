# Development Affordance
To iad you in the development and testing of your service locally on your machine we provide
some affordances that you can use.

## `ENV` Variables for Local Runs
If you need to use some `ENV` variables inside your service to customize its behaviour you can use the `--env`
flag and pass a [`.env` file path][dotenv-file-syntax] to it.  
For example you can add this script to your `package.json`:
```json
"scripts": {
  "start": "lc39 index.js",
  "start:local": "npm start -- --env-path ./local.env",
},
```

And then you will run the following command for starting the server locally:
```sh
npm run start:local
```

## `ENV` Variables for Testing
In a similar way, if your service needs to work with `ENV` variable we have some tips that will set you up
for using them in a safe way both in runtime and during unit testing your web service.

### Safe Use of `ENV` Variables During Runtime
We will reccommend to use the [`fastify-env`][fastify-env] package for validating them against a JSON schema
that you control.  
Inside your main entry point for the service you then can do somenthing like that:
```javascript
const fastifyEnv = require('fastify-env')

const envSchema = { ... }

module.exports = async function service(fastify) {
  fastify.register(fastifyEnv, { schema: envSchema })
}
```

In this way you can access all your `ENV` variables with `fastify.config`, and if one of them do not conform
to your schema the service will crash.

### Safe Use of `ENV` Variables During Runtime
For your tests if you have followed the previous advice you can add i tiny bit to it for a very big gain:
```javascript
const fastifyEnv = require('fastify-env')

const envSchema = { ... }

module.exports = async function service(fastify, options) {
  fastify.register(fastifyEnv, { schema: envSchema, data: options })
  fastify.register(fastifyEnv)
}
```

As you can see, the only difference is that we pass the `options` object as the base data for `fastify-env`.
In doing so, we will merge it with the `ENV` variables loaded in runtime giving the formers precedence over
the latters.  
Running the service normally will not change anything, because the options object will not be populated, but
you can use it during your tests for changing them very easily:
```javascript
const lc39 = require('@mia-platform/lc39')
const test = require('tap').test

test('A simple test', async assert => {
  const options {
    envVariables: {
      ENV_VARIABLE: 'value',
    }
  }
  const fastify = await lc39('./path/to/entrypoint/from/root', options)
  ...
})
```

From the `fastify` variable returned you can then customized it for your tests and injecting the calls you need to tests.  
By default the started instance will listen to the port `3000` and will start the logger at the `silent` level; if you
need to modify this values, you can set the `port` and/or `logLevel` keys inside the `options` object.

[dotenv-file-syntax]: https://www.npmjs.com/package/dotenv#rules
[fastify-env]: https://github.com/fastify/fastify-env
