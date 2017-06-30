const apiFetch = require('./api_fetch.js')

const getAllView = (dirname, views) => {
  const fs = require('mz/fs')
  const files = fs.readdirSync(dirname)

  for (const fileName of files) {
    const filePath = `${dirname}/${fileName}`
    const state = fs.statSync(filePath)
    if (state.isFile()) {
      views.push(filePath)
    }
    if (state.isDirectory()) {
      getAllView(filePath, views)
    }
  }
}

const getUrl = (service, query) => {
  let url = `${service.url}?`
  let key
  for (const param of service.queries) {
    key = param.key
    if (query[key] !== undefined) {
      url += `${key}=${encodeURI(query[key])}&`
    }
  }
  return url.substring(0, url.length - 1)
}

const fetchService = async (service, query, opts) => {
  const url = getUrl(service, query)
  const response = await apiFetch.sendGet(url, opts)
  if (response.status === 200) {
    console.log(`GET ${url}, httpStatus: ${response.status}, response[ ${JSON.stringify(response.body)} ]`)
    return response.body
  }
  console.error(`GET ${url}, httpStatus: ${response.status}, message[ ${response.body} ], case ${response.stack}`)
  return null
}

const fetchApi = async (ctx, services, opts) => {
  const model = {}
  const query = ctx.query
  if (services !== undefined) {
    if (services.length === 1) {
      model._DATA_ = await fetchService(services[0], query, opts)
    }
    for (const service of services) {
      model[service.key] = await fetchService(service, query, opts)
    }
  }
  return model
}

const factoryFunc = (view, services, opts) => async (ctx) => {
  const model = await fetchApi(ctx, services, opts)
  ctx.type = 'text/html'
  ctx.render(view, model)
}

const getBindding = (binddings, url) => {
  const bindding = binddings[url]
  const services = []
  if (bindding === undefined) {
    return services
  }
  if (bindding.service !== undefined) {
    services.push(bindding.service)
  }
  if (bindding.services !== undefined) {
    services.push(bindding.services)
  }
  return services
}

const addControllers = (router, dirname, viewBinddings, opts) => {
  console.log('=========================')
  console.log('======== views ==========')
  const views = []
  getAllView(dirname, views)

  for (const view of views) {
    const url = view.replace(dirname, '').replace('.html', '')
    console.log(`register view [${url}]`)
    const services = getBindding(viewBinddings, url)
    router.get(url, factoryFunc(view, services, opts))
  }
  console.log('=========================')
  return router.routes()
}

module.exports = (dirname, viewBinddings, opts) => {
  const controllerDir = dirname || './controller'
  // 使用koa-router 定义每个url所需要做的事
  const router = require('koa-router')()
  return addControllers(router, controllerDir, viewBinddings, opts)
}
