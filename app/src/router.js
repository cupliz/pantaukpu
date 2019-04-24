import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/home.vue'
import PPWP from './views/ppwp.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    { path: '/', component: Home },
    { path: '/pilpres', component: PPWP },
    { path: '/pilpres/:idProv', component: PPWP },
    { path: '/pilpres/:idProv/:idKab', component: PPWP },
    { path: '/pilpres/:idProv/:idKab/:idKec/', component: PPWP },
    { path: '/pilpres/:idProv/:idKab/:idKec/:idKel', component: PPWP },
    { path: '/pilpres/:idProv/:idKab/:idKec/:idKel/:idTps', component: PPWP },
    // { path: '/dpr', component: dprri },
    // { path: '/dprdprov', component: dprdprov },

    { path: '*', redirect: '/' }
  ]
})
