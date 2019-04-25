<template>
	<div>
		<div v-if="show=='error'">
			<h1>Not Found</h1>
		</div>
		<ul>
      <li style="display: inline-block;" v-for="(br,i) in breadcrumb" :key="i">
          <router-link :to="br.link">{{br.text}}</router-link> / &nbsp;
      </li>
    </ul>
		<!-- <label v-for="(br,i) in breadcrumb" :key="i"><router-link :to="'/pilpres/'">{{'asd'}}</router-link></label> -->
		<div v-if="show=='provinsi'">
			<h1>Provinsi</h1>
			<table>
				<tr>
					<th>Nama TPS</th>
					<th>Error</th>
					<th>Checked</th>
					<th>Total TPS</th>
					<th></th>
				</tr>
				<tr
				 v-for="prov in provinsi"
				 :key="prov.id"
				>
					<td>
						<router-link :to="'/pilpres/'+prov.id">{{prov.nama}}</router-link>
					</td>
					<td style="text-align: center;">{{prov.error}}</td>
					<td style="text-align: center;">{{prov.checked}}</td>
					<td style="text-align: center;">{{prov.total}}</td>
					<td><button @click="sync(prov)">Sync</button></td>
				</tr>
			</table>
		</div>

		<div v-if="show=='kabupaten'">
			<h1>Kabupaten</h1>
			<table>
				<tr>
					<th>Nama TPS</th>
					<th>Error</th>
					<th>Checked</th>
					<th>Total TPS</th>
				</tr>
				<tr
				 v-for="kab in kabupaten"
				 :key="kab.id"
				>
					<td>
						<router-link :to="`/pilpres/${idProv}/${kab.id}`">{{kab.nama}}</router-link>
					</td>
					<td style="text-align: center;">{{kab.error}}</td>
					<td style="text-align: center;">{{kab.checked}}</td>
					<td style="text-align: center;">{{kab.total}}</td>
				</tr>
			</table>
		</div>

		<div v-if="show=='kecamatan'">
			<h1>Kecamatan</h1>
			<table>
				<tr>
					<th>Nama TPS</th>
					<th>Error</th>
					<th>Checked</th>
					<th>Total TPS</th>
				</tr>
				<tr
				 v-for="kec in kecamatan"
				 :key="kec.id"
				>
					<td>
						<router-link :to="`/pilpres/${idProv}/${idKab}/${kec.id}`">{{kec.nama}}</router-link>
					</td>
					<td style="text-align: center;">{{kec.error}}</td>
					<td style="text-align: center;">{{kec.checked}}</td>
					<td style="text-align: center;">{{kec.total}}</td>
				</tr>
			</table>
		</div>

		<div v-if="show=='kelurahan'">
			<h1>Kelurahan</h1>
			<table>
				<tr>
					<th>Nama TPS</th>
					<th>Error</th>
					<th>Checked</th>
					<th>Total TPS</th>
				</tr>
				<tr
				 v-for="kel in kelurahan"
				 :key="kel.id"
				>
					<td>
						<router-link :to="`/pilpres/${idProv}/${idKab}/${idKec}/${kel.id}`">{{kel.nama}}</router-link>
					</td>
					<td style="text-align: center;">{{kel.error}}</td>
					<td style="text-align: center;">{{kel.checked}}</td>
					<td style="text-align: center;">{{kel.total}}</td>
				</tr>
			</table>
		</div>

		<table v-if="show=='tps'">
			<tr>
				<th>Nama TPS</th>
        <th>Suara Sah</th>
        <th>Suara Tidak Sah</th>
        <th>Suara Total</th>
        <th>DPT</th>
        <th>Tercoblos</th>
				<th>Gambar</th>
				<!-- <th>Detail</th> -->
			</tr>
			<tr v-for="tps in tps" :key="tps.id" >
				<td>{{tps.nama}}</td>
        <td>{{tps.hasil.suara_sah}}</td>
        <td>{{tps.hasil.suara_tidak_sah}}</td>
        <td>{{tps.hasil.suara_total}}</td>
        <td>{{tps.hasil.pemilih_j}}</td>
        <td>{{tps.hasil.pengguna_j}}</td>
				<td>
          <!-- <button @click="showImage(tps)">Show Images</button> -->
          <div>
            <img v-for="(img,i) in tps.hasil.images" :key="i" width="50px"
            :src="`https://pemilu2019.kpu.go.id/img/c/${tps.id.toString().substr(0,3)}/${tps.id.toString().substr(3,3)}/${tps.id}/${img}`">
          </div>
        </td>
				<!-- <td>{{JSON.stringify(tps)}}</td> -->
			</tr>
		</table>
	</div>
</template>

<script>
import axios from "axios";
export default {
	data() {
		return {
			show: "error",
			idProv: "",
			idKab: "",
			idKec: "",
			idKel: "",
			idTps: "",
			provinsi: [],
			kabupaten: [],
			kecamatan: [],
			kelurahan: [],
			tps: [],
      breadcrumb: "",
		};
	},
	methods: {
		async showBreadcrumb(data) {
			const here = location.href
				.replace(/(\?.*)$/, "")
				.split("/")
				.slice(3);

      const parts = [ { text: "Home", link: "/" } ];
			for (let j = 0; j < here.length; j++) {
        const part = here[j];
        let text = ''
				// const pageName = part.toLowerCase();
				// pageName = part.charAt(0).toUpperCase() + part.slice(1);
        const link = "/" + here.slice(0, j + 1).join("/");
        let page = ''
        if(j === 4){
          text = data.kelurahan
        }
        if(j === 3){
          text = data.kecamatan
        }
        if(j === 2){
          text = data.kabupaten
        }
        if(j === 1){
          text = data.provinsi
        }
        if(j === 0){
          text = part.charAt(0).toUpperCase() + part.slice(1)
        }
				parts.push({
					text,
					link
        });
      }
      this.breadcrumb = parts
		},
		async sync(prov) {
			console.log(prov.id);
			const { data } = axios.get(`${process.env.VUE_APP_API_URL}/sync/${prov.id}`);
			alert(`${prov.nama} akan segera di update`);
		},
		async getProvinsi() {
			const { data } = await axios.get(`${process.env.VUE_APP_API_URL}/ppwp`);
			if (data.status !== "404") {
				this.show = "provinsi";
				this.provinsi = Object.keys(data).map(res => data[res]);
			} else {
				this.show = "error";
			}
		},
		async getKabupaten(idProv) {
			this.show = "kabupaten";
			this.idProv = idProv;
			const { data } = await axios.get(`${process.env.VUE_APP_API_URL}/ppwp/${idProv}`);
			if (data.status !== "404") {
				this.kabupaten = Object.keys(data).map(res => data[res]);
			} else {
				this.show = "error";
			}
		},
		async getKecamatan(idProv, idKab) {
			this.show = "kecamatan";
			this.idProv = idProv;
			this.idKab = idKab;
			const { data } = await axios.get(
				`${process.env.VUE_APP_API_URL}/ppwp/${idProv}/${idKab}`
			);
			if (data.status !== "404") {
				this.kecamatan = Object.keys(data).map(res => data[res]);
			}
		},
		async getKelurahan(idProv, idKab, idKec) {
			const { data } = await axios.get(
				`${process.env.VUE_APP_API_URL}/ppwp/${idProv}/${idKab}/${idKec}`
			);
			if (data.status !== "404") {
				this.show = "kelurahan";
				this.idProv = idProv;
				this.idKab = idKab;
				this.idKec = idKec;
				this.kelurahan = Object.keys(data).map(res => data[res]);
			} else {
				this.show = "error";
			}
		},
		async getTPS(idProv, idKab, idKec, idKel) {
			const { data } = await axios.get(
				`${process.env.VUE_APP_API_URL}/ppwp/${idProv}/${idKab}/${idKec}/${idKel}`
			);
			if (data.status !== "404") {
				this.show = "tps";
				this.idProv = idProv;
				this.idKab = idKab;
				this.idKec = idKec;
				this.idKel = idKel;
				let tpsdata = Object.keys(data.output).map(res => data.output[res]);
				this.showBreadcrumb(data);
				this.tps = tpsdata;
			} else {
				this.show = "error";
			}
		},
		checkRoute(params) {
			const { idProv, idKab, idKec, idKel, idTps } = params;
			if (idProv && idKab && idKec && idKel) {
				this.getTPS(idProv, idKab, idKec, idKel);
			} else if (idProv && idKab && idKec) {
				this.getKelurahan(idProv, idKab, idKec);
			} else if (idProv && idKab) {
				this.getKecamatan(idProv, idKab);
			} else if (idProv) {
				this.getKabupaten(idProv);
			} else {
				this.getProvinsi();
			}
		}
	},
	watch: {
		$route(to, from) {
			this.checkRoute(to.params);
		},
		search() {} // needed to watch props search
	},
	mounted() {
		this.checkRoute(this.$route.params);
	}
};
</script>
