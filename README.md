<div align="center">

# Launch Complex 39

[![Node.js CI][action-status-svg]][github-action]
[![javascript style guide][standard-mia-svg]][standard-mia]  
[![Coverage Status][coverall-svg]][coverall-io]
[![NPM version][npmjs-svg]][npmjs-com]

</div>

**The Mia-Platform Node.js service launcher**

**lc39** is a Command line utility that will launch a [Fastify][fastify] instance configured
for serving a Node.js service on [Mia-Platform][mia-platform].

## Getting Started

### Install

To install the package you can run:

```sh
npm install @mia-platform/lc39 --save
```

It is possible to install the next version of the package, which use fastify v3. The version is a release candidate,
so it is not yet a stable version and should not be used in production environments (next updates could be breaking).
To try it, you can run:

```sh
npm install @mia-platform/lc39@next --save
```

We recommend to install the module locally on every one of your project to be able to
update them indipendently one from the other. To use the locally installed instance you
have to add the following script to your `package.json`:

```json
"scripts": {
  "start": "lc39 index.js"
},
```

To see all the options you can add to the cli run:

```
npx lc39 --help
```

Now you are ready to code your mia-platform service!

## Documentation

To work properly with **lc39** your service main file should follow some rules:
* [Main entrypoint](./docs/main-entrypoint.md)
* [Service options](./docs/service-options.md)
* [CLI flags](./docs/cli-flags.md)
* [Development affordance](./docs/development-affordance.md)

[action-status-svg]: https://github.com/mia-platform/lc39/actions/workflows/node.js.yml/badge.svg
[github-action]: https://github.com/mia-platform/lc39/actions/workflows/node.js.yml
[standard-mia-svg]: https://img.shields.io/badge/code_style-standard--mia-orange.svg
[standard-mia]: https://github.com/mia-platform/eslint-config-mia
[coverall-svg]: https://coveralls.io/repos/github/mia-platform/lc39/badge.svg
[coverall-io]: https://coveralls.io/github/mia-platform/lc39
[npmjs-svg]: https://img.shields.io/npm/v/@mia-platform/lc39.svg?logo=npm
[npmjs-com]: https://www.npmjs.com/package/@mia-platform/lc39

[fastify]: https://www.fastify.io/
[mia-platform]: https://www.mia-platform.eu/
[pino]: http://getpino.io/
