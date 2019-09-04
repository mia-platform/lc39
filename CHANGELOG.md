# Changelog

All notable changes to this project will be documented in this file.  
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Unreleased

### Added

- Add custom serializers for logging requests, responses and errors key inside the logs
- Add customization for the stream property of the logger during tests

### Changed

- Update commander 2.20.0 -> 5.0.0
- Update dotenv 8.0.0 -> 8.2.1
- Update fastify 2.11.0 -> 2.12.1
- Update fastify-plugin 1.6.0 -> 1.6.1
- Update fastify-swagger 2.4.0 -> 2.5.0
- Update make-promises-safe 5.0.0 -> 5.1.0

### Removed

- Dropped support to Node 8

## v2.4.0 - 2020-01-31

### Added

- Added default `return503OnClosing: false` option to Fastify
- Added `SIGTERM` signal handler

### Changed

- Update fastify 2.7.1 -> 2.11.0

## v2.3.0 - 2019-11-21

### Changed

- Updated status routes log level to error instead of silent
  (unless silent is provided from configuration).

## v2.2.2 - 2019-08-08

- Update fastify 2.6.0 -> 2.7.1

## v2.2.1 - 2019-07-08

### Changed

- Update fastify 2.5.0 -> 2.6.0

## v2.2.0 - 2019-06-20

### Added

- Add `/-/check-up` status endpoint

### Changed

- Update fastify-sensible 2.0.1 -> 2.1.1
- Update fastify 2.4.1 -> 2.5.0
- Update fastify-plugin 1.5.0 -> 1.6.0

## v2.1.2 - 2019-05-22

### Changed

- Update fastify 2.3.0 -> 2.4.1
- Update fastify-swagger 2.3.2 -> 2.4.0
- New eslint configuration

## v2.1.1 - 2019-05-03

### Changed

- Update fastify 2.2.0 -> 2.3.0
- Update dotenv 7.0.0 -> 8.0.0

## v2.1.0 - 2019-04-17

### Added

- Add default `bodyLimit` parameter to `fastify`

## v2.0.0 - 2019-04-11

### Added

- Add typescript definitions

### Changed

- The exported module will create a `fastify` instace that is not listening
  on any port.

## v1.1.0 - 2019-04-10

### Added

- Add `errorHandler` options for customize `fastify-sensible`
  auto handling of uncatched errors

## v1.0.0 - 2019-04-09

### Added

- Add `fastify-sensible` plugin integration

## v0.4.0 - 2019-04-08

### Added

- Add `/documentation/` route via `fastify-swagger`

### Changed

- Update commander 2.19.0 -> 2.20.0
- Update dotenv 6.2.0 -> 7.0.0
- Update dotenv-expand 4.2.0 -> 5.1.0
- Update fastify 1.14.0 -> 2.2.0
- Update fastify-plugin 1.4.0 -> 1.5.0
- Update make-promises-safe 4.0.0 -> 5.0.0
- Update eslint 5.14.1 -> 5.16.0
- Update tap 12.5.3 -> 12.6.1
- Use directly eslint-config-mia without standard-mia engine
- Use the `fastify` embedded version of `pino`

## v0.3.0 - 2019-02-06

### Changed

- Fixed `ENV` injection in `testLaunch` function
- Fixed override of default values in `testLaunch` function
- Relincesed under Apache 2.0 from MIT

## v0.2.0 - 2019-01-16

### Added

- Add `/-/healthz and` `/-/ready` status endpoints.

## v0.1.0 - 2019-01-08

- Initial relase
