import 'dotenv/config'
import koa from 'koa'
import cors from '@koa/cors'
import router from './router'

const app = new koa()

app.use(cors())
app.use(router.routes())
console.log('API runs on port: ', process.env.PORT)
app.listen(process.env.PORT)