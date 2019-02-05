/*
 * Copyright 2019 Mia srl
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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
