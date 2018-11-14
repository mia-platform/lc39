'use strict'

const dotenv = require('dotenv')
const dotenvExpand = require('dotenv-expand')
const absolutePath = require('./absolute-path')

module.exports = function importEnvs(path) {
  if (!path) {
    return
  }

  const envPath = absolutePath(path)
  const myEnv = dotenv.config({ path: envPath })
  dotenvExpand(myEnv)
}
