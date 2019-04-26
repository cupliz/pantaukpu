const wilayah = require('./wilayah')
const db = require('../plugins/db')

const provinsi = async ctx => {
  let result = {}
  let output = await wilayah.provinsi();
  for (let i = 0; i < Object.keys(output).length; i++) {
    const id = Object.keys(output)[i];
    const getError = await db.table('error')
    .count('id as error')
    .where('provinsi',id)
    .where('resolve',0)
    const getJumlah = await db.table('ppwp')
    .count('id as checked')
    .where('provinsi',id)
    .where('ts','>','')
    output[id].checked = getJumlah.length?getJumlah[0].checked:0
    output[id].error = getError.length?getError[0].error:0
  }
  const crumb = await breadcrumb(ctx) 
  result.crumb = crumb
  result.table = output
  ctx.body = result;
};

const kabupaten = async ctx => {
  const { idProv } = ctx.params;
  if (idProv > 0) {
    let result = {}
    let output = await wilayah.kabupaten(idProv);
    for (let i = 0; i < Object.keys(output).length; i++) {
      const id = Object.keys(output)[i];
      const getError = await db.table('error')
      .count('id as error')
      .where('kabupaten',id)
      .where('resolve',0)
      const getJumlah = await db.table('ppwp')
      .count('id as checked')
      .where('kabupaten',id)
      output[id].checked = getJumlah.length?getJumlah[0].checked:0
      output[id].error = getError.length?getError[0].error:0
    }
    const crumb = await breadcrumb(ctx) 
    result.crumb = crumb
    result.table = output
    ctx.body = result;
  } else {
    ctx.body = { status: "404", statusText: "Not Found" };
  }
};

const kecamatan = async ctx => {
  const { idProv, idKab } = ctx.params;
  if (idProv > 0 && idKab > 0) {
    let result = {}
    let output = await wilayah.kecamatan(idProv, idKab);
    for (let i = 0; i < Object.keys(output).length; i++) {
      const id = Object.keys(output)[i];
      const getError = await db.table('error')
      .count('id as error')
      .where('kecamatan',id)
      .where('resolve',0)
      const getJumlah = await db.table('ppwp')
      .count('id as checked')
      .where('kecamatan',id)
      output[id].checked = getJumlah.length?getJumlah[0].checked:0
      output[id].error = getError.length?getError[0].error:0
    }
    const crumb = await breadcrumb(ctx) 
    result.crumb = crumb
    result.table = output
    ctx.body = result;
  } else {
    ctx.body = { status: "404", statusText: "Not Found" };
  }
};

const kelurahan = async ctx => {
  const { idProv, idKab, idKec } = ctx.params;
  let result = {}
  if (idProv > 0 && idKab > 0 && idKec > 0) {
    let output = await wilayah.kelurahan(idProv, idKab, idKec);
    for (let i = 0; i < Object.keys(output).length; i++) {
      const id = Object.keys(output)[i];
      const getError = await db.table('error')
      .count('id as error')
      .where('kelurahan',id)
      .where('resolve',0)
      const getJumlah = await db.table('ppwp')
      .count('id as checked')
      .where('kelurahan',id)
      output[id].checked = getJumlah.length?getJumlah[0].checked:0
      output[id].error = getError.length?getError[0].error:0
    }
    const crumb = await breadcrumb(ctx) 
    result.crumb = crumb
    result.table = output
    ctx.body = result;
  } else {
    ctx.body = { status: "404", statusText: "Not Found" };
  }
};

const tps = async ctx => {
  const { idProv, idKab, idKec, idKel } = ctx.params;
  if (idProv > 0 && idKab > 0 && idKec > 0 && idKel > 0) {
    let result = {}
    let output = await wilayah.tps(idProv, idKab, idKec, idKel);
    for (let i = 0; i < Object.keys(output).length; i++) {
      const id = Object.keys(output)[i];
      const detail = await tpsDetail(id)
      output[id].hasil = Object.keys(detail.data).length ? JSON.parse(detail.data) : {}

      const getError = await db.table('error')
      .where('id',id)
      .where('resolve',0)
      output[id].error = getError.length?getError[0].type:0
    }
    const crumb = await breadcrumb(ctx) 
    result.crumb = crumb
    result.table = output
    ctx.body = result
  } else {
    ctx.body = { status: "404", statusText: "Not Found" };
  }
};

const tpsDetail = async idTps => {
  let output = {};
  const get0 = await db.table("ppwp")
    .where("ppwp.id", idTps)
  if (get0.length) {
    const res0 = get0.length ? get0[0] : {};
    output = res0;
  }
  return output;
};

const breadcrumb = async (ctx) => {
  const { idProv, idKab, idKec, idKel } = ctx.params;
  let crumb = {}
  if(idKel){
    const kelurahan = await db.table('kelurahan').where('id', idKel)
    crumb.kelurahan = kelurahan? kelurahan[0].nama:''
  }
  if(idKec){
    const kecamatan = await db.table('kecamatan').where('id', idKec)
    crumb.kecamatan = kecamatan? kecamatan[0].nama:''
  }
  if(idKab){
    const kabupaten = await db.table('kabupaten').where('id', idKab)
    crumb.kabupaten = kabupaten? kabupaten[0].nama:''
  }
  if(idProv){
    const provinsi = await db.table('provinsi').where('id', idProv)
    crumb.provinsi = provinsi? provinsi[0].nama:''
  }
  return crumb
  // const current = await db.table('kelurahan as kel')
  // .select('kel.nama as kelurahan', 'kec.nama as kecamatan', 'kab.nama as kabupaten', 'prov.nama as provinsi')
  // .leftJoin('kecamatan as kec', 'kec.id', 'kel.kecamatan')
  // .leftJoin('kabupaten as kab', 'kab.id', 'kel.kabupaten')
  // .leftJoin('provinsi as prov', 'prov.id', 'kel.provinsi')
  // .where('kel.id', idKel)
  // if(current.length){
  //   result.provinsi = current[0].provinsi
  //   result.kabupaten = current[0].kabupaten
  //   result.kecamatan = current[0].kecamatan
  //   result.kelurahan = current[0].kelurahan
  //   result.output = output
  // }
}

module.exports =  {
  provinsi,
  kabupaten,
  kecamatan,
  kelurahan,
  tps
};
