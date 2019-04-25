require('dotenv').config()
const koa  = require('koa')
const cors = require('@koa/cors')
const router = require('./router')

const app = new koa()

app.use(cors())
app.use(router.routes())
console.log('API runs on port: ', process.env.PORT)
app.listen(process.env.PORT)