import db from "../plugins/db";
import api from "../plugins/axios";
// const {data: ppwp} = await api.get(`${process.env.URL_PPWP}/${prov}.json`);
// const {data: wilayah} = await api.get(`${process.env.URL_WILAYAH}/${prov}.json`)

const provinsi = async ctx => {
  let output = {};
  const get0 = await db.table("provinsi").select("id", "nama");
  if (get0.length) {
    for (let i = 0; i < get0.length; i++) {
      const res0 = get0[i];
      output[res0.id] = res0;
    }
  } else {
    try {
      const { data } = await api.get(`${process.env.URL_WILAYAH}/0.json`);
      for (let i = 0; i < Object.keys(data).length; i++) {
        const id = Object.keys(data)[i];
        const nama = data[id].nama;
        const dapil = JSON.stringify(data[id].dapil);
        await db.table("provinsi").insert({ id, nama, dapil });
      }
      const get1 = await db.table("provinsi").select("id", "nama");
      for (let i = 0; i < getProvinsi2.length; i++) {
        const res1 = get1[i];
        output[res1.id] = res1;
      }
    } catch (error) {
      const { status, statusText } = error.response;
      output = { status, statusText };
    }
  }
  ctx.body = output;
};

const kabupaten = async ctx => {
  console.log('kabupaten')
  const { idProv } = ctx.params;
  if (idProv > 0) {
    let output = {};
    const get0 = await db
      .table("kabupaten")
      .select("id", "nama")
      .where("provinsi", idProv);

    if (get0.length) {
      for (let i = 0; i < get0.length; i++) {
        const res0 = get0[i];
        output[res0.id] = res0;
      }
    } else {
      try {
        // add kabupaten to database
        const { data } = await api.get(
          `${process.env.URL_WILAYAH}/${idProv}.json`
        );
        for (let i = 0; i < Object.keys(data).length; i++) {
          const id = Object.keys(data)[i];
          const provinsi = idProv;
          const nama = data[id].nama;
          const dapil = JSON.stringify(data[id].dapil);
          await db.table("kabupaten").insert({ id, provinsi, nama, dapil });
        }

        const get1 = await db
          .table("kabupaten")
          .select("id", "nama")
          .where("provinsi", idProv);
        for (let i = 0; i < get1.length; i++) {
          const res1 = get1[i];
          output[res1.id] = res1;
        }
      } catch (error) {
        const { status, statusText } = error.response;
        output = { status, statusText };
      }
    }
    ctx.body = output;
  } else {
    ctx.body = { status: "404", statusText: "Not Found" };
  }
};

const kecamatan = async ctx => {
  console.log('kecamatan')
  const { idProv, idKab } = ctx.params;
  if (idProv > 0 && idKab > 0) {
    let output = {};
    const get0 = await db
      .table("kecamatan")
      .select("id", "nama")
      .where("provinsi", idProv)
      .where("kabupaten", idKab);

    if (get0.length) {
      for (let i = 0; i < get0.length; i++) {
        const res0 = get0[i];
        output[res0.id] = res0;
      }
    } else {
      // add kecamatan to database
      try {
        const { data } = await api.get(
          `${process.env.URL_WILAYAH}/${idProv}/${idKab}.json`
        );
        for (let i = 0; i < Object.keys(data).length; i++) {
          const id = Object.keys(data)[i];
          const provinsi = idProv;
          const kabupaten = idKab;
          const nama = data[id].nama;
          const dapil = JSON.stringify(data[id].dapil);
          await db
            .table("kecamatan")
            .insert({ id, provinsi, kabupaten, nama, dapil });
        }

        const get1 = await db
          .table("kecamatan")
          .select("id", "nama")
          .where("provinsi", idProv)
          .where("kabupaten", idKab);
        for (let i = 0; i < get1.length; i++) {
          const res1 = get1[i];
          output[res1.id] = res1;
        }
      } catch (error) {
        const { status, statusText } = error.response;
        output = { status, statusText };
      }
    }
    ctx.body = output;
  } else {
    ctx.body = { status: "404", statusText: "Not Found" };
  }
};

const kelurahan = async ctx => {
  console.log("kelurahan");
  const { idProv, idKab, idKec } = ctx.params;
  if (idProv > 0 && idKab > 0 && idKec > 0) {
    let output = {};
    const get0 = await db
      .table("kelurahan")
      .select("id", "nama")
      .where("provinsi", idProv)
      .where("kabupaten", idKab)
      .where("kecamatan", idKec);

    if (get0.length) {
      for (let i = 0; i < get0.length; i++) {
        const res0 = get0[i];
        output[res0.id] = res0;
      }
    } else {
      // add kecamatan to database]
      try {
        const { data } = await api.get(
          `${process.env.URL_WILAYAH}/${idProv}/${idKab}/${idKec}.json`
        );
        for (let i = 0; i < Object.keys(data).length; i++) {
          const id = Object.keys(data)[i];
          const provinsi = idProv;
          const kabupaten = idKab;
          const kecamatan = idKec;
          const nama = data[id].nama;
          const dapil = JSON.stringify(data[id].dapil);
          await db
            .table("kelurahan")
            .insert({ id, provinsi, kabupaten, kecamatan, nama, dapil });
        }

        const get1 = await db
          .table("kelurahan")
          .select("id", "nama")
          .where("provinsi", idProv)
          .where("kabupaten", idKab)
          .where("kecamatan", idKec);
        for (let i = 0; i < get1.length; i++) {
          const res1 = get1[i];
          output[res1.id] = res1;
        }
      } catch (error) {
        const { status, statusText } = error.response;
        output = { status, statusText };
      }
    }
    ctx.body = output;
  } else {
    ctx.body = { status: "404", statusText: "Not Found" };
  }
};

const tps = async ctx => {
  console.log("tps");
  const { idProv, idKab, idKec, idKel } = ctx.params;
  if (idProv > 0 && idKab > 0 && idKec > 0 && idKel > 0) {
    let output = {};
    const get0 = await db
      .table("tps")
      .select("id", "nama")
      .where("provinsi", idProv)
      .where("kabupaten", idKab)
      .where("kecamatan", idKec)
      .where("kelurahan", idKel);

    if (get0.length) {
      for (let i = 0; i < get0.length; i++) {
        const res0 = get0[i];
        output[res0.id] = res0;
      }
    } else {
      // // // add kecamatan to database
      try {
        const { data } = await api.get(
          `${process.env.URL_WILAYAH}/${idProv}/${idKab}/${idKec}/${idKel}.json`
        );
        for (let i = 0; i < Object.keys(data).length; i++) {
          const id = Object.keys(data)[i];
          const provinsi = idProv;
          const kabupaten = idKab;
          const kecamatan = idKec;
          const kelurahan = idKel;
          const nama = data[id].nama;
          const dapil = JSON.stringify(data[id].dapil);
          await db.table("tps").insert({
            id,
            provinsi,
            kabupaten,
            kecamatan,
            kelurahan,
            nama,
            dapil
          });
        }

        const get1 = await db
          .table("tps")
          .select("id", "nama")
          .where("provinsi", idProv)
          .where("kabupaten", idKab)
          .where("kecamatan", idKec)
          .where("kelurahan", idKel);
        for (let i = 0; i < get1.length; i++) {
          const res1 = get1[i];
          output[res1.id] = res1;
        }
      } catch (error) {
        const { status, statusText } = error.response;
        output = { status, statusText };
      }
    }
    ctx.body = output;
  } else {
    ctx.body = { status: "404", statusText: "Not Found" };
  }
};

export default {
  provinsi,
  kabupaten,
  kecamatan,
  kelurahan,
  tps
};

// let provinsi = await getProvinsi()
// if(provinsi.length){
//   for (let a = 0; a < provinsi.length; a++) {
//     const prov = provinsi[a];
//     const kabupaten = await getKabupaten(prov.id)
//     if(kabupaten.length){
//       provinsi[a].kabupaten = kabupaten
//       for (let b = 0; b < kabupaten.length; b++) {
//         const kab = kabupaten[b];
//         const kecamatan = await getKecamatan(prov.id, kab.id)
//         console.log(kecamatan)
//         // if(kecamatan.length){
//         //   // provinsi[a].kabupaten[b].kecamatan = kecamatan
//         // }
//       }
//     }
//   }
// }
