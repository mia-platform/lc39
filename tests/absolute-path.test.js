'use strict'

const path = require('path')
const absolutePath = require('../lib/absolute-path')
const { test } = require('tap')

test('Test absolute path generation', assert => {
  const path1 = absolutePath('/absolute/test/path.js')
  assert.strictSame(path1, '/absolute/test/path.js')

  const path2 = absolutePath('.dotfilename')
  assert.strictSame(path2, `${process.cwd()}/.dotfilename`)

  const path3 = absolutePath('./relative/path.js')
  assert.strictSame(path3, `${process.cwd()}/relative/path.js`)

  const path4 = absolutePath('../../relative/to/parent/path.js')
  const parentPath = path.resolve(process.cwd(), '../..')
  assert.strictSame(path4, `${parentPath}/relative/to/parent/path.js`)

  assert.end()
})
