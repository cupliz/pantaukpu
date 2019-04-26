const ppwp = require('./ppwp')
const wilayah = require('./wilayah')
const sync = require('./sync')
const {api} = require('../plugins/axios')


const app = async ctx => {
  const url = "https://pemilu2019.kpu.go.id/static/json/hhcw/ppwp.json"
  const {data} = await api.get(url)
  console.log(data.length)
  ctx.body = { app: "hello world" };
};
sync.index()
module.exports = {
  app,
  ppwp,
  sync
};
