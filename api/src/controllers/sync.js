const db = require("../plugins/db");
const api = require("../plugins/axios");
const wilayah = require("./wilayah");
// 'https://pemilu2019.kpu.go.id/static/json/wilayah/1.json'
// 'https://pemilu2019.kpu.go.id/static/json/hhcw/ppwp.json'
const sync = async ctx => {
  let x = 0;
  const { idProv } = ctx.params;
  const kabupaten = await wilayah.kabupaten(idProv);
  for (let c = 0; c < Object.keys(kabupaten).length; c++) {
    const idKab = Object.keys(kabupaten)[c];
    const kecamatan = await wilayah.kecamatan(idProv, idKab);
    for (let d = 0; d < Object.keys(kecamatan).length; d++) {
      const idKec = Object.keys(kecamatan)[d];
      const kelurahan = await wilayah.kelurahan(idProv, idKab, idKec);
      for (let e = 0; e < Object.keys(kelurahan).length; e++) {
        const idKel = Object.keys(kelurahan)[e];
        const tps = await wilayah.tps(idProv, idKab, idKec, idKel);
        for (let f = 0; f < Object.keys(tps).length; f++) {
          x++;
          const idTps = Object.keys(tps)[f];
          await sleep(10);
          console.log( `${x} processing ${kelurahan[idKel].nama} ${tps[idTps].nama} ...` );
          const checked = await db.table("ppwp").where("tps", idTps);
          if (!checked.length) {
            syncTPS(idProv, idKab, idKec, idKel, idTps);
          }
        }
      }
    }
  }
  console.log(`${idProv} done !`);
  ctx.body = "sync...";
};

const syncTPS = async (idProv, idKab, idKec, idKel, idTps) => {
  try {
    const { data } = await api.get( `${ process.env.URL_PPWP }/${idProv}/${idKab}/${idKec}/${idKel}/${idTps}.json` );
    let insertData = {
      tps: idTps,
      kelurahan: idKel,
      kecamatan: idKec,
      kabupaten: idKab,
      provinsi: idProv
    };
    if (Object.keys(data).length) {
      checkError(data, { idProv, idKab, idKec, idKel, idTps });
      insertData['ts'] = data.ts
      insertData['data'] = JSON.stringify(data),
      db.table("ppwp").insert(insertData);
    }else{
      // db.table("ppwp").insert(insertData);
    }
  } catch (error) {
    console.log(error.code)
  }
};

const checkError = async (data, area) => {
  const { idProv, idKab, idKec, idKel, idTps } = area;
  const { chart, suara_sah, suara_tidak_sah, suara_total } = data;
  const total_suara_sah = chart["21"] + chart["22"];
  if (suara_sah !== total_suara_sah) {
    const insert = {
      type: 1,
      id: idTps,
      provinsi: idProv,
      kabupaten: idKab,
      kecamatan: idKec,
      kelurahan: idKel
    };
    db.table("error").insert(insert);
  }
  if((suara_sah+suara_tidak_sah) !== suara_total){
    const insert = {
      type: 2,
      id: idTps,
      provinsi: idProv,
      kabupaten: idKab,
      kecamatan: idKec,
      kelurahan: idKel
    };
    db.table("error").insert(insert);
  }
};

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
module.exports = sync;
