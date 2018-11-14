'use strict'

const path = require('path')

module.exports = function absolutePath(filePath) {
  return path.resolve(process.cwd(), filePath)
}
