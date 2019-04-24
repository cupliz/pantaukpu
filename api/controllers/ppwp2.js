import db from '../plugins/db'
import api from '../plugins/axios'
// 'https://pemilu2019.kpu.go.id/static/json/wilayah/1.json'
// 'https://pemilu2019.kpu.go.id/static/json/hhcw/ppwp.json'

const index = async (ctx) => {
  const {action} = ctx.query
  if(action=='sync'){
    const {data} = await api.get(`${process.env.URL_HHCW}/ppwp.json`)
    const get0 = await db.table('ppwp')
    .where('parent', 0)
    .where('ts', data.ts)
    if(!get0.length){
      const insert = { parent: 0, ts: data.ts, data: JSON.stringify(data) }
      await db.table('ppwp').insert(insert)
    }
    ctx.body = data
  }else{
    const get0 = await db.table('ppwp')
    .where('parent', 0)
    .orderBy('ts', 'desc')
    .limit(1)
    ctx.body = get0.length ? get0[0].data : {}
  }
}

const provinsi = (ctx)=>{
  ctx.body = ctx.params
}
const kabupaten = (ctx)=>{
  ctx.body = ctx.params
}
const kecamatan = (ctx)=>{
  ctx.body = ctx.params
}
const kelurahan = (ctx)=>{
  ctx.body = ctx.params
}
const tps = (ctx)=>{
  ctx.body = ctx.params
}

export default {
  index,
  provinsi,
  kabupaten,
  kecamatan,
  kelurahan,
  tps
}