import db from '../plugins/db'
import api from '../plugins/axios'
// 'https://pemilu2019.kpu.go.id/static/json/wilayah/1.json'
// 'https://pemilu2019.kpu.go.id/static/json/hhcw/ppwp.json'

const sync = async (ctx) => {
 ctx.body = {}
}
const syncWilayah = async (ctx) => {
  // // get data from local
  // const local = await db.table('ppwp')
  // .where('parent', 0)
  // .orderBy('ts', 'desc')
  // .limit(1)
  // const data = local ? JSON.parse(local[0].data) : {}

  
}
const syncProv = async (id) =>{
  const {data} = await api.get(`${process.env.URL_WILAYAH}/${id}.json`)
  console.log(data)
  // const get = await db.table('ppwp').where('parent', id).where('ts', data.ts)
  // if(!get.length){
  //   const insert = { parent: id, ts: data.ts, data: JSON.stringify(data) }
  //   await db.table('ppwp').insert(insert)
  // }
  // return data
}
export default sync