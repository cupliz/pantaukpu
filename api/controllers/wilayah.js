import db from "../plugins/db";
import api from "../plugins/axios";

const provinsi = async () => {
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
      for (let i = 0; i < get1.length; i++) {
        const res1 = get1[i];
        output[res1.id] = res1;
      }
    } catch (error) {
      output = { status: "404", statusText: "Not Found" };
    }
  }
  return output;
};

const kabupaten = async idProv => {
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
      output = { status: "404", statusText: "Not Found" };
    }
  }
  return output;
};

const kecamatan = async (idProv, idKab) => {
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
      output = { status: "404", statusText: "Not Found" };
    }
  }
  return output;
};

const kelurahan = async (idProv, idKab, idKec) => {
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
      output = { status: "404", statusText: "Not Found" };
    }
  }
  return output;
};
const tps = async (idProv, idKab, idKec, idKel) => {
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
    // add kecamatan to database
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
      output = { status: "404", statusText: "Not Found" };
    }
  }
  return output;
};

const tpsDetail = async (idProv, idKab, idKec, idKel, idTps) => {
  let output = {};
  const get0 = await db
    .table("tps")
    .select("id", "nama")
    .where("provinsi", idProv)
    .where("kabupaten", idKab)
    .where("kecamatan", idKec)
    .where("kelurahan", idKel)
    .where("id", idTps)

  if (get0.length) {
    for (let i = 0; i < get0.length; i++) {
      const res0 = get0[i];
      output[res0.id] = res0;
    }
  }
  return output;
};

export default {
  provinsi,
  kabupaten,
  kecamatan,
  kelurahan,
  tps,
  tpsDetail
};
