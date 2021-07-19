# Logging

The library generates logs following [Mia-Platform logging guidelines](https://docs.mia-platform.eu/docs/development_suite/monitoring-dashboard/dev_ops_guide/log).

For a json schema example check [test log schema file](../tests/log.schema.json)

## Additional information to response logs

It is possible to add custom information to request completed logs.
In your handler, or in a hook (before the onResponse hook which write the response log), you could add to the fastify reply object an `additionalRequestCompletedLogInfo` field.
This field must be an object, and will be added to the request completed log.

For example: 

```js
fastify.post('/items/:itemId', {
  onRequest: function (req, reply, done) {
    reply.additionalRequestCompletedLogInfo = {
      custom: 'property',
    }
    done()
  }
}, function handler(request, reply) {
  reply.send({ created: 'true' })
})
```
