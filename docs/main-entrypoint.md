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

## Custom Status Routes
With `lc39` your service will automatically inherit **two** fixed routes for getting infomation on the
service:

- `GET /-/healthz`
- `GET /-/ready`

The first route can be used as a probe for load balancers, status dashboards
and as a [`helthinessProbe`][k8s-deployment-probes] for [Kubernetes][k8s].  
By default, the route will always response with an `OK` status and the `200` `HTTP` code as soon as the service is up.

The second route can be used as a [`readinessProbe`][k8s-deployment-probes] for Kubernetes.  
As the first route, the default implementation of this endpoint will always respond
`OK` status and the `200` `HTTP` code as soon as the service is up.

The default implementations are a nice placeholder until you can add some logic tied to your service.  
For doing so you can add two new `module.exports` to your main entrypoint that will be used instead of the defaults.

```javascript
module.exports.readinessHandler = function readinessHandler(request, reply) {
  // Add your custom logic for /-/ready here
}
module.exports.healthinessHandler = function readinessHandler(request, reply) {
  // Add your custom logic for /-/healthz here
}
```

Both of these entpoint will be validated agains a JSON schema that you can find [here][status-routes-schema].  
Additionally you will be able to access the variable `this.serviceName` to use it as the value of the `name`
property in the response and it will default to the name of your service as set by `npm` or the one in
`package.json`.

**BE AWARE**  
Both of this endpoints are set to permanently run on log level `silent` for decreasing the amount of noise in the logs during the
deployment.

[k8s]: https://kubernetes.io/
[k8s-deployment-probes]: https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-probes/
[status-routes-schema]: ../lib/status-routes.schema.json
