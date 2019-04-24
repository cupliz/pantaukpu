import db from "../plugins/db";
import api from "../plugins/axios";
import wilayah from "./wilayah"
// const {data: ppwp} = await api.get(`${process.env.URL_PPWP}/${prov}.json`);
// const {data: wilayah} = await api.get(`${process.env.URL_WILAYAH}/${prov}.json`)

const provinsi = async ctx => {
  let output = await wilayah.provinsi()
  ctx.body = output;
};

const kabupaten = async ctx => {
  const { idProv } = ctx.params;
  if (idProv > 0) {
    let output = await wilayah.kabupaten(idProv)
    ctx.body = output;
  } else {
    ctx.body = { status: "404", statusText: "Not Found" };
  }
};

const kecamatan = async ctx => {
  const { idProv, idKab } = ctx.params;
  if (idProv > 0 && idKab > 0) {
    let output = await wilayah.kecamatan(idProv, idKab)
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

    const {data} = await api.get(`${process.env.URL_PPWP}/${idProv}/${idKab}/${idKec}/${idKel}.json`)
    console.log(data)
    for (let i = 0; i < Object.keys(output).length; i++) {
      const id = Object.keys(output)[i];
      output[id].hasil = data.table[id]
      output[id].ts = data.ts
    }
    ctx.body = output;
  } else {
    ctx.body = { status: "404", statusText: "Not Found" };
  }
};

const tpsDetail = async ctx => {
  const { idProv, idKab, idKec, idKel, idTps} = ctx.params;
  if (idProv > 0 && idKab > 0 && idKec > 0 && idKel > 0 && idTps > 0) {
    let output = await wilayah.tpsDetail(idProv, idKab, idKec, idKel, idTps);

    const {data} = await api.get(`${process.env.URL_PPWP}/${idProv}/${idKab}/${idKec}/${idKel}/${idTps}.json`)
    output[idTps].hasil = data
    ctx.body = output;
  } else {
    ctx.body = { status: "404", statusText: "Not Found" };
  }
};
const checkError = async () => {
  console.log('check error')
}
export default {
  provinsi,
  kabupaten,
  kecamatan,
  kelurahan,
  tps,
  tpsDetail
};
