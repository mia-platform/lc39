# Service Options

If you want to customize the Fastify instance over the default settings that **lc39** will set
you can export a json object in your module:

```javascript
module.exports.options = {
  redact: {
    paths: ['supersecret', 'notread[*].here'],
    censor: '[YOUTRIED]',
  },
  trustProxy: '127.0.0.1',
  errorHandler: false,
}
```

The values supported in this object are the supported keys and value for the Fastify server instance
that you can find at this [link][fastify-server-options]; with the exception of the `logger` parameter.  
Instead you can customize the `pino` instance via the `logLevel` key and you can modify the redaction rules
via the `redact` key. For this key the accepted values listed [here][pino-redact-options].  
You have an additional key, `errorHandler` that is passed to the `fastify-sensible` plugin;
its usage can be found [here][fastify-sensible-error-handler].

[fastify-server-options]: https://github.com/fastify/fastify/blob/master/docs/Server.md
[pino-redact-options]: https://github.com/pinojs/pino/blob/master/docs/redaction.md
[fastify-sensible-error-handler]: https://github.com/fastify/fastify-sensible#custom-error-handler
