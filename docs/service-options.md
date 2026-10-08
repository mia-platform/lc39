# Service Options

If you want to customize the Fastify instance over the default settings that **lc39** will set
you can export a JSON object in your module:

```javascript
module.exports.options = {
  redact: {
    paths: ['supersecret', 'notread[*].here'],
    censor: '[YOUTRIED]',
  },
  trustProxy: '127.0.0.1',
  oasRefResolver: {
    buildLocalReference(json, baseUri, fragment, i) {
      // your naming convention
    }
  },
  logger:{
    customLevels: {
      audit: 35,
      success: 70
    },
    hooks: {
      logMethod (inputArgs, method, level) {
        // Here you can manipulate the parameters passed to the logger methods
        return method.apply(this, inputArgs) // This achieves the default behavior, i.e. not manipulating anything
      }
    }
  }
}
```

The key and values supported in this object correspond to the options of the Fastify server instance documented at [link][fastify-server-options],
with the exception of the `logger` parameter, that allows you to:

- add a [custom logging level][pino-custom-levels] using the `customLevel` field;
- add [hooks][pino-hooks] to customize internal logger operations using the `hooks` field.

Instead you can customize the `pino` instance via the `logLevel` and `logger.customLevels` keys, and you can modify the redaction rules
via the `redact` key. For this key the accepted values are listed [here][pino-redact-options].  
You have the following additional keys:
- `oasRefResolver` that is passed to the `fastify-swagger` plugin as `refResolver`; its usage can be found [here][fastify-swagger-refs]. 

[fastify-sensible-error-handler]: https://github.com/fastify/fastify-sensible#custom-error-handler
[fastify-server-options]: https://github.com/fastify/fastify/blob/main/docs/Reference/Server.md
[fastify-swagger-refs]: https://github.com/fastify/fastify-swagger#managing-your-refs
[pino-custom-levels]: https://github.com/pinojs/pino/blob/master/docs/api.md#opt-customlevels
[pino-hooks]: https://github.com/pinojs/pino/blob/master/docs/api.md#hooks-object
[pino-redact-options]: https://github.com/pinojs/pino/blob/master/docs/redaction.md
