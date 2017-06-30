const apiFetch = require('./api_fetch.js')

const apiRouter = opts => async (ctx, next) => {
  const url = ctx.url
  if (url.startsWith('/api/')) {
    try {
      const response = await apiFetch.fetchApi(ctx, opts)
      if (response.status === 200) {
        console.log(`${ctx.request.method} ${url}, httpStatus: ${response.status}, response[ ${JSON.stringify(response.body)} ]`)
        ctx.response.body = response.body
        ctx.response.status = response.status
      } else {
        console.error(`${ctx.request.method} ${url} fail, httpStatus: ${response.status}, message: ${response.message}, case ${response.stack}`)
        ctx.response.message = response.message
        ctx.response.status = response.status
        ctx.response.stack = response.stack
      }
    } catch (err) {
      console.error(`${ctx.request.method} ${url} fail, err: ${err.message}, case ${err.stack}`)
      ctx.response.message = err.message
      ctx.response.stack = err.stack
      ctx.response.status = 500
    }
  } else {
    await next()
  }
}

module.exports = apiRouter
