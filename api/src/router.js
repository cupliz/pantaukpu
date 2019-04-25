const KoaRouter = require('koa-router')
const c = require('./controllers')

const router = new KoaRouter()

router.get('/', c.app)
router.get('/ppwp', c.ppwp.provinsi)
router.get('/ppwp/:idProv', c.ppwp.kabupaten)
router.get('/ppwp/:idProv/:idKab', c.ppwp.kecamatan)
router.get('/ppwp/:idProv/:idKab/:idKec', c.ppwp.kelurahan)
router.get('/ppwp/:idProv/:idKab/:idKec/:idKel', c.ppwp.tps)
router.get('/sync/:idProv', c.sync.queue)

module.exports = router