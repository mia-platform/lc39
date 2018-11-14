# Launch Complex 39
[![javascript style guide][standard-mia-svg]][standard-mia]

**The Mia-Platform Node.js service launcher**

**lc39** is a Command line utility that will launch a [Fastify][fastify] instance configured
for serving a Node.js service on [Mia-Platform][mia-platform].

## Getting Started
### Install
To install the package you can run:
```sh
npm install @mia-platform/lc39 --save
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

## Service Configurations
To work properly with **lc39** your service main file should follow some rules:
* [Main entrypoint](./docs/main-entrypoint.md)
* [Service options](./docs/service-options.md)
* [CLI flags](./docs/cli-flags.md)
* [Development affordance](./docs/development-affordance.md)

[standard-mia-svg]: https://img.shields.io/badge/code_style-standard--mia-orange.svg
[standard-mia]: https://github.com/mia-platform/standard-mia

[fastify]: https://www.fastify.io/
[mia-platform]: https://www.mia-platform.eu/
[pino]: http://getpino.io/
