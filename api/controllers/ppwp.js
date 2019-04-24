import db from "../plugins/db";
import wilayah from "./wilayah";
// const {data: ppwp} = await api.get(`${process.env.URL_PPWP}/${prov}.json`);
// const {data: wilayah} = await api.get(`${process.env.URL_WILAYAH}/${prov}.json`)

const provinsi = async ctx => {
  let output = await wilayah.provinsi();
  ctx.body = output;
};

const kabupaten = async ctx => {
  const { idProv } = ctx.params;
  if (idProv > 0) {
    let output = await wilayah.kabupaten(idProv);
    ctx.body = output;
  } else {
    ctx.body = { status: "404", statusText: "Not Found" };
  }
};

const kecamatan = async ctx => {
  const { idProv, idKab } = ctx.params;
  if (idProv > 0 && idKab > 0) {
    let output = await wilayah.kecamatan(idProv, idKab);
    ctx.body = output;
  } else {
    ctx.body = { status: "404", statusText: "Not Found" };
  }
};

const kelurahan = async ctx => {
  const { idProv, idKab, idKec } = ctx.params;
  if (idProv > 0 && idKab > 0 && idKec > 0) {
    let output = await wilayah.kelurahan(idProv, idKab, idKec);
    ctx.body = output;
  } else {
    ctx.body = { status: "404", statusText: "Not Found" };
  }
};

const tps = async ctx => {
  const { idProv, idKab, idKec, idKel } = ctx.params;
  if (idProv > 0 && idKab > 0 && idKec > 0 && idKel > 0) {
    let output = await wilayah.tps(idProv, idKab, idKec, idKel);
    for (let i = 0; i < Object.keys(output).length; i++) {
      const id = Object.keys(output)[i];
      const detail = await tpsDetail(id)
      output[id].hasil = Object.keys(detail).length ? JSON.parse(detail.data) : {};
    }
    ctx.body = output;
  } else {
    ctx.body = { status: "404", statusText: "Not Found" };
  }
};

const tpsDetail = async idTps => {
  let output = {};
  const get0 = await db.table("ppwp").where("tps", idTps);
  if (get0.length) {
    const res0 = get0.length ? get0[0] : {};
    output = res0;
  }
  return output;
};

export default {
  provinsi,
  kabupaten,
  kecamatan,
  kelurahan,
  tps
};
