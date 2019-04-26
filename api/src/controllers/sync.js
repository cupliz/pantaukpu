const db = require("../plugins/db");
const {api} = require("../plugins/axios");
const wilayah = require("./wilayah");

const queue = async ctx => {
  const { idProv } = ctx.params;
  const payload = {
    provinsi: idProv,
    status: 0
  };
  const check = await db
    .table("queue")
    .where("provinsi", idProv)
    .where("status", 0)
    .orderBy("id", "desc");
  if (!check.length) {
    await db.table("queue").insert(payload);
  }
  index();
  ctx.body = "sync..";
};
const index = async () => {
  console.log('syncronizing...')
  let x = 0;
  const queue = await db
    .table("queue")
    .where("status", 0)
    .limit(1)
    .orderBy("id", "asc");
  const idProv = queue.length ? queue[0].provinsi : 0;
  if (idProv) {
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
            if (idTps !== "status" && idTps !== "statusText") {
              // console.log( `${x} processing ${kelurahan[idKel].nama} ${ tps[idTps].nama } ...` );
              const checked = await db
                .table("ppwp")
                .select("id")
                .where("id", idTps);
              if (!checked.length) {
                await syncTPS(idProv, idKab, idKec, idKel, idTps, x);
              } else {
              }
            }
          }
        }
      }
    }
    await db
      .table("queue")
      .update({ status: 1 })
      .where("provinsi", idProv);
    console.log(`${idProv} done !`);
  }else{
    console.log(`nothing to sync !`)
  }
};

const syncTPS = async (idProv, idKab, idKec, idKel, idTps, x) => {
  try {
    let ts = "";
    let string = "";
    const { data } = await api.get( `${ process.env.URL_PPWP }/${idProv}/${idKab}/${idKec}/${idKel}/${idTps}.json`
    );
    if (Object.keys(data).length) {
      console.log(x, idTps, data.ts);
      await checkError(data, { idProv, idKab, idKec, idKel, idTps });
      ts = data.ts;
      string = JSON.stringify(data);
    }
    let insertData = {
      id: idTps,
      ts,
      data: string,
      kelurahan: idKel,
      kecamatan: idKec,
      kabupaten: idKab,
      provinsi: idProv
    };
    await db.table("ppwp").insert(insertData);
    sleep(50);
  } catch (error) {
    console.log(`${idTps} ${error.code}`);
  }
};

const checkError = async (data, area) => {
  try {
    const { idProv, idKab, idKec, idKel, idTps } = area;
    const { chart, suara_sah, suara_tidak_sah, suara_total } = data;
    const total_suara_sah = chart["21"] + chart["22"];
    let type = [];
    if (suara_sah !== total_suara_sah) {
      type.push(1);
    }
    if (suara_sah + suara_tidak_sah !== suara_total) {
      type.push(2);
    }
    if(type.length > 0){
      const insert = {
        type: JSON.stringify(type),
        id: idTps,
        provinsi: idProv,
        kabupaten: idKab,
        kecamatan: idKec,
        kelurahan: idKel
      };
      await db.table("error").insert(insert);
    }
  } catch (error) {
    console.log(`${error.code}`);
  }
};

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
module.exports = {
  index,
  queue
};
