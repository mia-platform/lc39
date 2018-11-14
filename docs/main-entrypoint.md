# Main Entrypoint
**lc39** dose some assumption on how the main entrypoint of your service can be layed out.  
This in order to correctly import and validate the functions and data passed to it and for correctly create
and launch the Fastify instance.

## Main Exported Function
Your service must export a function for its module. The function can have a single parameter or two:
- fastify: the instace of the fastify server created by **lc39**
- options: the optional parameter, this will contain the object passed to fastify for setting up your module

```javascript
module.exports = async function service(fastify) {
  fastify.get('/', async (req, reply) => {
    return { hello: 'world' }
  })
}
```

As you can see the function must be declared `async` and must be exported as the root of the module.  
