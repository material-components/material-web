/**
 * Copyright 2016 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const Koa = require('koa');
const mount = require('koa-mount');
const staticFiles = require('koa-static');
const {nodeResolve} = require('koa-node-resolve');
const {esmTransform} = require('koa-esm-transform');

module.exports = (karma) =>
    new Koa()
        .use(esmTransform())
        .use(mount('/base', new Koa().use(nodeResolve()).use(staticFiles('.'))))
        .use(karma);