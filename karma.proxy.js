const Koa = require('koa');
const mount = require('koa-mount');
const {nodeResolve} = require('koa-node-resolve');
module.exports = (karma) => new Koa()
    .use(mount('/base', nodeResolve()))
    .use(karma);