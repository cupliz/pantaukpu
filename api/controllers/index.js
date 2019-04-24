import ppwp from './ppwp'

const app = (ctx) => {
  ctx.body = {app: 'hello world'}
}

export default {
  app,
  ppwp,
}