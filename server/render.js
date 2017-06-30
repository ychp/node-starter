const nunjucks = require('nunjucks')

const createEnv = (path, opts) => {
  const env = new nunjucks.Environment(
    new nunjucks.FileSystemLoader(path, {
      noCache: opts.noCache || false,
      watch: opts.watch || false,
    }), {
      autoescape: opts.autoescape && true,
      throwOnUndefined: opts.throwOnUndefined || false
    })
  if (opts.filters) {
    for (const f in opts.filters) {
      env.addFilter(f, opts.filters[f])
    }
  }
  return env
}

const render = (path, opts) => {
  const env = createEnv(path, opts)
  return async (ctx, next) => {
    // 给ctx绑定render函数:
    ctx.render = function (view, model) {
      // 把render后的内容赋值给response.body:
      ctx.response.body = env.render(view, Object.assign({}, ctx.state || {}, model || {}))
      // 设置Content-Type:
      ctx.response.type = 'text/html'
    }
    await next()
  }
}

module.exports = render
