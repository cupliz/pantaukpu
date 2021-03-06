const wilayah = require('./wilayah')
const db = require('../plugins/db')
const getStatistic = async (type,id) => {
  const getData = await db.table('ppwp as p')
  .count('p.id as checked')
  .count('e.id as error')
  .select(db.raw(`sum(case when p.ts > '' then 1 else 0 end) filled`))
  .leftJoin('error as e', 'e.id', 'p.id')
  .where(`p.${type}`,id)
  const checked = getData.length ? getData[0].checked : 0
  const filled = getData.length ? getData[0].filled : 0
  const error = getData.length ? getData[0].error : 0
  return {
    checked,
    filled,
    error
  }
}
const provinsi = async ctx => {
  let result = {}
  let output = await wilayah.provinsi();
  for (let i = 0; i < Object.keys(output).length; i++) {
    const id = Object.keys(output)[i];
    const {filled,checked,error} = await getStatistic('provinsi',id)
    output[id].filled = filled || 0
    output[id].checked = checked  || 0
    output[id].error = error || 0
  }
  const getAll = await db.table('ppwp as p')
    .count('p.id as checked')
    .count('e.id as error')
    .select(db.raw(`sum(case when p.ts > '' then 1 else 0 end) filled`))
    .leftJoin('error as e', 'e.id', 'p.id')
  result.all = {
    checked: getAll.length ? getAll[0].checked : 0,
    filled: getAll.length ? getAll[0].filled : 0,
    error: getAll.length ? getAll[0].error : 0
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
      const {filled,checked,error} = await getStatistic('kabupaten',id)
      output[id].filled = filled || 0
      output[id].checked = checked || 0
      output[id].error = error || 0
    }
    const getAll = await db.table('ppwp as p')
      .count('p.id as checked')
      .count('e.id as error')
      .select(db.raw(`sum(case when p.ts > '' then 1 else 0 end) filled`))
      .leftJoin('error as e', 'e.id', 'p.id')
    result.all = {
      checked: getAll.length ? getAll[0].checked : 0,
      filled: getAll.length ? getAll[0].filled : 0,
      error: getAll.length ? getAll[0].error : 0
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
      const {filled,checked,error} = await getStatistic('kecamatan',id)
      output[id].filled = filled || 0
      output[id].checked = checked || 0
      output[id].error = error || 0
    }
    const getAll = await db.table('ppwp as p')
      .count('p.id as checked')
      .count('e.id as error')
      .select(db.raw(`sum(case when p.ts > '' then 1 else 0 end) filled`))
      .leftJoin('error as e', 'e.id', 'p.id')
    result.all = {
      checked: getAll.length ? getAll[0].checked : 0,
      filled: getAll.length ? getAll[0].filled : 0,
      error: getAll.length ? getAll[0].error : 0
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
      const {filled,checked,error} = await getStatistic('kelurahan',id)
      output[id].filled = filled || 0
      output[id].checked = checked || 0
      output[id].error = error || 0
    }
    const getAll = await db.table('ppwp as p')
      .count('p.id as checked')
      .count('e.id as error')
      .select(db.raw(`sum(case when p.ts > '' then 1 else 0 end) filled`))
      .leftJoin('error as e', 'e.id', 'p.id')
    result.all = {
      checked: getAll.length ? getAll[0].checked : 0,
      filled: getAll.length ? getAll[0].filled : 0,
      error: getAll.length ? getAll[0].error : 0
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
      output[id].hasil = Object.keys(detail).length && Object.keys(detail.data).length ? JSON.parse(detail.data) : {}

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
    const kelurahan = await db.table('kelurahan').select('nama').where('id', idKel)
    crumb.kelurahan = kelurahan? kelurahan[0].nama:''
  }
  if(idKec){
    const kecamatan = await db.table('kecamatan').select('nama').where('id', idKec)
    crumb.kecamatan = kecamatan? kecamatan[0].nama:''
  }
  if(idKab){
    const kabupaten = await db.table('kabupaten').select('nama').where('id', idKab)
    crumb.kabupaten = kabupaten? kabupaten[0].nama:''
  }
  if(idProv){
    const provinsi = await db.table('provinsi').select('nama').where('id', idProv)
    crumb.provinsi = provinsi? provinsi[0].nama:''
  }
  return crumb
}

module.exports =  {
  provinsi,
  kabupaten,
  kecamatan,
  kelurahan,
  tps
};
