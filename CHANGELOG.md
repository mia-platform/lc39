# Changes to `lc39`

### v2.1.2 (2019-05-22)

- Update fastify 2.3.0 -> 2.4.1
- Update fastify-swagger 2.3.2 -> 2.4.0
- New eslint configuration

### v2.1.1 (2019-05-03)

- Update tap 12.6.2 -> 13.1.2
- Update fastify 2.2.0 -> 2.3.0
- Update dotenv 7.0.0 -> 8.0.0

### v2.1.0 (2019-04-17)

- Update tap 12.6.1 -> 12.6.2
- Add default `bodyLimit` parameter to `fastify`

### v2.0.0 (2019-04-11)

- The exported module will create a `fastify` instace that
  is not listening on any port.
- Add typescript definitions

### v1.1.0 (2019-04-10)

- Add `errorHandler` options for customize `fastify-sensible`
  auto handling of uncatched errors

### v1.0.0 (2019-04-09)

- Add `fastify-sensible` plugin integration

### v0.4.0 (2019-04-08)

- Update commander 2.19.0 -> 2.20.0
- Update dotenv 6.2.0 -> 7.0.0
- Update dotenv-expand 4.2.0 -> 5.1.0
- Update fastify 1.14.0 -> 2.2.0
- Update fastify-plugin 1.4.0 -> 1.5.0
- Update make-promises-safe 4.0.0 -> 5.0.0
- Update eslint 5.14.1 -> 5.16.0
- Update tap 12.5.3 -> 12.6.1
- Add `/documentation/` route via `fastify-swagger`
- Use directly eslint-config-mia without standard-mia engine
- Use the `fastify` embedded version of `pino`

### v0.3.0 (2019-02-06)

- Fixed `ENV` injection in `testLaunch` function
- Fixed override of default values in `testLaunch` function
- Relincesed under Apache 2.0 from MIT

### v0.2.0 (2019-01-16)

- Add `/-/healthz and` `/-/ready` status endpoints.

### v0.1.0 (2019-01-08)

- Initial relase
