const staticFilter = (regx, dir) => async (ctx, next) => {
  let url = ctx.url
  if (url.startsWith(regx)) {
    const fs = require('mz/fs')
    const mime = require('mime')
    url = url.replace(regx, '')
    const filePath = `${dir}${url}`
    if (await fs.exists(filePath)) {
      ctx.response.type = await mime.lookup(filePath)
      ctx.response.body = await fs.readFile(filePath, 'utf-8')
    } else {
      ctx.response.status = 404
    }
  } else {
    await next()
  }
}

module.exports = staticFilter
