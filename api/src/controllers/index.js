const ppwp = require('./ppwp')
const wilayah = require('./wilayah')
const sync = require('./sync')
const db = require('../plugins/db')
const api = require('../plugins/axios')

const app = ctx => {
  ctx.body = { app: "hello world" };
};
sync.index()
module.exports = {
  app,
  ppwp,
  sync
};
