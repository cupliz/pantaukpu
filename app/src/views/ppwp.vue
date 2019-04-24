<template>
	<div>
    <div v-if="show=='error'">
      <h1>Not Found</h1>
    </div>
		<ol v-if="show=='provinsi'">
			<li v-for="prov in provinsi" :key="prov.id" >
				<router-link :to="'/pilpres/'+prov.id">{{prov.nama}}</router-link>
			</li>
		</ol>
		<ol v-if="show=='kabupaten'">
			<li v-for="kab in kabupaten" :key="kab.id" >
				<router-link :to="`/pilpres/${idProv}/${kab.id}`">{{kab.nama}}</router-link>
			</li>
		</ol>
		<ol v-if="show=='kecamatan'">
			<li v-for="kec in kecamatan" :key="kec.id" >
				<router-link :to="`/pilpres/${idProv}/${idKab}/${kec.id}`">{{kec.nama}}</router-link>
			</li>
		</ol>
		<ol v-if="show=='kelurahan'">
			<li v-for="kel in kelurahan" :key="kel.id" >
				<router-link :to="`/pilpres/${idProv}/${idKab}/${idKec}/${kel.id}`">{{kel.nama}}</router-link>
			</li>
		</ol>
    
    <table v-if="show=='tps'">
      <tr>
        <th width="10%">Nama TPS</th>
        <!-- <th width="10%">Gambar</th> -->
        <th width="50%">Detail</th>
      </tr>
      <tr v-for="tps in tps" :key="tps.id">
        <td>{{tps.nama}}</td>
        <!-- <td> <img src="https://pemilu2019.kpu.go.id/img/c/900/238/900238858/28380-02-C-XXX-X6.jpg" width="50px" alt=""> </td> -->
        <td>{{JSON.stringify(tps)}}</td>
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
      idProv: '',
      idKab: '',
      idKec: '',
      idKel: '',
      idTps: '',
			provinsi: [],
			kabupaten: [],
			kecamatan: [],
			kelurahan: [],
			tps: [],
		};
	},
	methods: {
		async getProvinsi() {
			const { data } = await axios.get("http://localhost:4003/ppwp");
      if(data.status !== '404'){
			  this.show = "provinsi";
        this.provinsi = Object.keys(data).map(res => data[res]);
      }else{
        this.show = 'error'
      }
		},
		async getKabupaten(idProv) {
      this.show = "kabupaten";
      this.idProv = idProv
			const { data } = await axios.get(`http://localhost:4003/ppwp/${idProv}`);
      if(data.status !== '404'){
        this.kabupaten = Object.keys(data).map(res => data[res]);
      }else{
        this.show = 'error'
      }
		},
		async getKecamatan(idProv, idKab) {
      this.show = "kecamatan";
      this.idProv = idProv
      this.idKab = idKab
			const { data } = await axios.get(`http://localhost:4003/ppwp/${idProv}/${idKab}`);
      if(data.status !== '404'){
        this.kecamatan = Object.keys(data).map(res => data[res]);
      }
		},
		async getKelurahan(idProv, idKab, idKec) {
      const { data } = await axios.get(`http://localhost:4003/ppwp/${idProv}/${idKab}/${idKec}`);
      if(data.status !== '404'){
        this.show = "kelurahan";
        this.idProv = idProv
        this.idKab = idKab
        this.idKec = idKec
        this.kelurahan = Object.keys(data).map(res => data[res]);
      }else{
        this.show = 'error'
      }
    },
		async getTPS(idProv, idKab, idKec, idKel) {
      const { data } = await axios.get(`http://localhost:4003/ppwp/${idProv}/${idKab}/${idKec}/${idKel}`);
      if(data.status !== '404'){
        this.show = "tps";
        this.idProv = idProv
        this.idKab = idKab
        this.idKec = idKec
        this.idKel = idKel
        let tpsdata = Object.keys(data).map(res => data[res]);
        
        // for (let i = 0; i < Object.keys(data).length; i++) {
        //   const idTPS = Object.keys(data)[i]
        //   // const { data: tpsdetail } = await axios.get(`http://localhost:4003/ppwp/${idProv}/${idKab}/${idKec}/${idKel}/${idTPS}`);
        //   // console.log(tpsdetail)
        //   tpsdata.detail = tpsdetail[tpsd.id]
        // }
        this.tps = tpsdata
      }else{
        this.show = 'error'
      }
    },
    checkRoute (params){
      const { idProv, idKab, idKec, idKel, idTps } = params;
      if(idProv && idKab && idKec && idKel){
        this.getTPS(idProv, idKab, idKec, idKel)
      }else if(idProv && idKab && idKec){
        this.getKelurahan(idProv, idKab, idKec)
      }else if(idProv && idKab){
        this.getKecamatan(idProv, idKab)
      }else if(idProv){
        this.getKabupaten(idProv)
      }else{
        this.getProvinsi();
      }
    }
	},
	watch: {
		$route(to, from) {
     this.checkRoute(to.params)
		},
		search() {} // needed to watch props search
	},
	mounted() {
    this.checkRoute(this.$route.params)
	}
};
</script>
