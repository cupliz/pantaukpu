<template>
	<div>
    <nav>
      <div class="nav-wrapper">
        <div class="container">
          <a v-for="(br,i) in breadcrumb" :key="i" class="breadcrumb">
            <router-link :to="br.link">{{br.text}}</router-link>
          </a>
        </div>
      </div>
    </nav>
		<div class="container">
			<div class="row">
				<div class="col s12">
					<p><span class="red-text">Error:</span> TPS dengan data salah input</p>
					<p><span class="green-text">Filled:</span> TPS yang datanya tidak kosong, atau sudah terinput oleh KPU</p>
					<p><span class="blue-text">Checked:</span> seluruh TPS yang berhasil dicek yang datanya isi maupun masih kosong</p>
					<p><span class="purple-text">Total: </span> TPS total dari sebuah daerah</p>
					<div class="card col s12 cyan lighten-1 white-text">
						<div class="card-content">
							Anda dapat membantu mempercepat verifikasi dengan cara menekan tombol &nbsp; 
							<button class="btn btn-small btn-floating pink accent-2 waves-effect waves-light"><i class="material-icons">refresh</i></button>
							<br><sub>(*) fitur akan muncul di update berikutnya</sub>
						</div>
					</div>
				</div>
			</div>
		</div>

		<div class="container">
			<div class="row">
				<div class="col s12 m3 right" v-if="show!=='tps'">
					<h4 class="title">Statistik</h4>
					<p class="red-text">TPS Error: <span class="right">{{allStats && allStats.error}}</span></p>
					<p class="green-text">TPS Filled: <span class="right">{{allStats && allStats.filled}}</span></p>
					<p class="blue-text">TPS Checked: <span class="right">{{allStats && allStats.checked}}</span></p>
					<p class="purple-text">Total: <span class="right">{{allStats &&  allStats.total || '-'}}</span> </p>
				</div>

				<div v-if="show=='error'">
					<h4 class="header">Not Found</h4>
				</div>
				<div v-if="show=='loading'">
					<h5 class="card-title">Loading...</h5>
				</div>

				<div class="col s12 m9">
					<div v-if="show=='provinsi'">
						<h4 class="title">Provinsi</h4>
						<table>
							<tr>
								<th>Nama TPS</th>
								<th class="red-text">Error</th>
								<th class="green-text">Filled</th>
								<th class="blue-text">Checked</th>
								<th class="purple-text">Total</th>
								<!-- <th></th> -->
							</tr>
							<tr v-for="prov in provinsi" :key="prov.id" >
								<td>
									<router-link :to="'/pilpres/'+prov.id">{{prov.nama}}</router-link>
								</td>
								<td>{{prov.error}}</td>
								<td>{{prov.filled}}</td>
								<td>{{prov.checked}}</td>
								<td>{{prov.total || '-'}}</td>
								<!-- <td><button @click="sync(prov)">Sync</button></td> -->
							</tr>
						</table>
					</div>

					<div v-if="show=='kabupaten'">
						<h4 class="header">Kabupaten</h4>
						<table>
							<tr>
								<th>Nama TPS</th>
								<th class="red-text">Error</th>
								<th class="green-text">Filled</th>
								<th class="blue-text">Checked</th>
								<th class="purple-text">Total</th>
							</tr>
							<tr
							v-for="kab in kabupaten"
							:key="kab.id"
							>
								<td>
									<router-link :to="`/pilpres/${idProv}/${kab.id}`">{{kab.nama}}</router-link>
								</td>
								<td>{{kab.error}}</td>
								<td>{{kab.checked}}</td>
								<td>{{kab.total || '-'}}</td>
							</tr>
						</table>
					</div>

					<div v-if="show=='kecamatan'">
						<h4 class="header">Kecamatan</h4>
						<table>
							<tr>
								<th>Nama TPS</th>
								<th class="red-text">Error</th>
								<th class="green-text">Filled</th>
								<th class="blue-text">Checked</th>
								<th class="purple-text">Total</th>
							</tr>
							<tr
							v-for="kec in kecamatan"
							:key="kec.id"
							>
								<td>
									<router-link :to="`/pilpres/${idProv}/${idKab}/${kec.id}`">{{kec.nama}}</router-link>
								</td>
								<td>{{kec.error}}</td>
								<td>{{kec.checked}}</td>
								<td>{{kec.total || '-'}}</td>
							</tr>
						</table>
					</div>

					<div v-if="show=='kelurahan'">
						<h4 class="header">Kelurahan</h4>
						<table>
							<tr>
								<th>Nama TPS</th>
								<th class="red-text">Error</th>
								<th class="green-text">Filled</th>
								<th class="blue-text">Checked</th>
								<th class="purple-text">Total</th>
							</tr>
							<tr
							v-for="kel in kelurahan"
							:key="kel.id"
							>
								<td>
									<router-link :to="`/pilpres/${idProv}/${idKab}/${idKec}/${kel.id}`">{{kel.nama}}</router-link>
								</td>
								<td>{{kel.error}}</td>
								<td>{{kel.checked}}</td>
								<td>{{kel.total || '-'}}</td>
							</tr>
						</table>
					</div>
				</div>
			</div>
		</div>
    <div v-if="show=='tps'" class="container">
      <table>
        <tr>
          <th>Nama TPS</th>
          <th>01</th>
          <th>02</th>
          <th>Suara Sah</th>
          <th>Suara Tidak Sah</th>
          <th>Suara Total</th>
          <th>DPT</th>
          <th>Tercoblos</th>
          <th>Gambar</th>
          <!-- <th>Detail</th> -->
        </tr>
        <tr v-for="tps in tps" :key="tps.id" :class="tps.error?'red':''">
          <td>{{tps.nama}}</td>
          <td>{{tps.hasil.chart ? tps.hasil.chart['21'] : 0}}</td>
          <td>{{tps.hasil.chart ? tps.hasil.chart['22'] : 0}}</td>
          <td>{{tps.hasil.suara_sah||0}}</td>
          <td>{{tps.hasil.suara_tidak_sah||0}}</td>
          <td>{{tps.hasil.suara_total||0}}</td>
          <td>{{tps.hasil.pemilih_j||0}}</td>
          <td>{{tps.hasil.pengguna_j||0}}</td>
          <td>
            <div>
              <img class="materialboxed" v-for="(img,i) in tps.hasil.images" :key="i" width="50px"
              :src="`https://pemilu2019.kpu.go.id/img/c/${tps.id.toString().substr(0,3)}/${tps.id.toString().substr(3,3)}/${tps.id}/${img}`"
							>
            </div>
          </td>
        </tr>
      </table>
    </div>
	</div>
</template>

<script>
import axios from "axios";
import plugins from "../../public/js/plugins";

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
			allStats: {},
		};
	},
	methods: {
		toggleLightbox (idTps, source){		
			document.addEventListener('DOMContentLoaded', function() {
				const elems = document.querySelectorAll('.materialboxed');
				const instance = M.Materialbox.getInstance(elems);
				console.log(instance)
			});
		},
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
			const { data } = axios.get(`${process.env.VUE_APP_API_URL}/sync/${prov.id}`);
			alert(`${prov.nama} akan segera di update`);
		},
		async getProvinsi() {
			this.show = 'loading'
			const { data } = await axios.get(`${process.env.VUE_APP_API_URL}/ppwp`);
			if (data.status !== "404") {
				this.provinsi = Object.keys(data.table).map(res => data.table[res]);
				this.allStats = data.all
				this.showBreadcrumb(data.crumb);
				this.show = "provinsi";
			} else {
				this.show = "error";
			}
		},
		async getKabupaten(idProv) {
			this.show = 'loading'
			this.idProv = idProv;
			const { data } = await axios.get(`${process.env.VUE_APP_API_URL}/ppwp/${idProv}`);
			if (data.status !== "404") {
				this.kabupaten = Object.keys(data.table).map(res => data.table[res]);
				this.allStats = data.all
				this.showBreadcrumb(data.crumb);
				this.show = "kabupaten";
			} else {
				this.show = "error";
			}
		},
		async getKecamatan(idProv, idKab) {
			this.show = 'loading'
			this.idProv = idProv;
			this.idKab = idKab;
			const { data } = await axios.get(
				`${process.env.VUE_APP_API_URL}/ppwp/${idProv}/${idKab}`
			);
			if (data.status !== "404") {
				this.kecamatan = Object.keys(data.table).map(res => data.table[res]);
				this.allStats = data.all
				this.showBreadcrumb(data.crumb);
				this.show = "kecamatan";
			}
		},
		async getKelurahan(idProv, idKab, idKec) {
			this.show = "loading";
			const { data } = await axios.get(
				`${process.env.VUE_APP_API_URL}/ppwp/${idProv}/${idKab}/${idKec}`
			);
			if (data.status !== "404") {
				this.idProv = idProv;
				this.idKab = idKab;
				this.idKec = idKec;
				this.kelurahan = Object.keys(data.table).map(res => data.table[res]);
				this.allStats = data.all
				this.showBreadcrumb(data.crumb);
				this.show = "kelurahan";
			} else {
				this.show = "error";
			}
		},
		async getTPS(idProv, idKab, idKec, idKel) {
				this.show = "loading";
			const { data } = await axios.get(
				`${process.env.VUE_APP_API_URL}/ppwp/${idProv}/${idKab}/${idKec}/${idKel}`
			);
			if (data.status !== "404") {
				this.idProv = idProv;
				this.idKab = idKab;
				this.idKec = idKec;
				this.idKel = idKel;
        let tpsdata = Object.keys(data.table).map(res => data.table[res]);
				this.allStats = data.all
				this.showBreadcrumb(data.crumb);
				this.tps = tpsdata;
				this.show = "tps";
			} else {
				this.show = "error";
			}
		},
		checkRoute(params) {
			plugins()
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
	},
};
</script>
<style>
/* .materialboxed.active {
	position: absolute; z-index: 1000; will-change: left, top, width, height; width: 546px; height: 409.5px; left: 102.844px; top: 262.047px; max-width: 546%;
}
.material-placeholder{
	width: 718.906px; height: 487.5px; position: relative; top: 0px; left: 0px;
}
#materialbox-overlay{
	opacity: 0.; width: 1586px; height: 455px; left: 0px; top: 0px;
} */
</style>
