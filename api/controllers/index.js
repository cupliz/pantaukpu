import ppwp from "./ppwp";
import wilayah from "./wilayah";
import db from "../plugins/db";
import api from "../plugins/axios";
import { setTimeout } from "timers";

const app = ctx => {
  ctx.body = { app: "hello world" };
};

const sync = async ctx => {
  const { idProv } = ctx.params;
  const kabupaten = await wilayah.kabupaten(idProv);
  await Object.keys(kabupaten).map(async idKab => {
    const kecamatan = await wilayah.kecamatan(idProv, idKab);
    await Object.keys(kecamatan).map(async idKec => {
      const kelurahan = await wilayah.kelurahan(idProv, idKab, idKec);
      await Object.keys(kelurahan).map(async idKel => {
        const tps = await wilayah.tps(idProv, idKab, idKec, idKel);
        await Object.keys(tps).map(async idTps => {
          console.log( `processing ${kelurahan[idKel].nama} ${tps[idTps].nama} ...` );
          setTimeout(() => {
            syncTPS(idProv, idKab, idKec, idKel, idTps);
          }, 100);
        });
      });
    });
  });
  ctx.body = "sync...";
};

const syncTPS = async (idProv, idKab, idKec, idKel, idTps) => {
  let checked = await db.table("ppwp").where("tps", idTps);
  if (checked.length) {
  } else {
    try {
      let { data } = await api.get( `${ process.env.URL_PPWP }/${idProv}/${idKab}/${idKec}/${idKel}/${idTps}.json` );
      if (Object.keys(data).length) {
        const { chart, suara_sah } = data;
        const total = chart["21"] + chart["22"];
        if (suara_sah !== total) {
          const insert = { 
            id: idTps,
            provinsi: idProv,
            kabupaten: idKab,
            kecamatan: idKec,
            kelurahan: idKel,
          }
          db.table("error").insert(insert);
        }
        const insertData = {
          ts: data.ts,
          data: JSON.stringify(data),
          tps: idTps,
          kelurahan: idKel,
          kecamatan: idKec,
          kabupaten: idKab,
          provinsi: idProv
        };
        db.table("ppwp").insert(insertData);
      }
    } catch (error) {}
  }
};

const checkError = async () => {
  console.log("check error");
};

export default {
  app,
  ppwp,
  sync
};
