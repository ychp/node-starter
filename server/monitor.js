const monitor = (opts) => {
  return async (ctx, next) => {
    const start = new Date().getTime() // 当前时间
    await next() // 调用下一个middleware
    const ms = new Date().getTime() - start // 耗费时间
    if(ctx.response.status == 200) {
      console.log(`${ctx.request.method} ${ctx.request.url}, cost ${ms} ms`) // 打印耗费时间
    } else {
      console.error(`request [ ${ctx.request.method} ${ctx.request.url} ] fail, err: [ code: ${ctx.response.status}, message: ${ctx.response.message} ], cost ${ms} ms`) // 打印耗费时间
    }
  }
}

module.exports = monitor