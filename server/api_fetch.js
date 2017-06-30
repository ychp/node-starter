const superagent = require('superagent')

const fetchGet = (ctx, url, opts) => {
  if (ctx !== undefined && ctx !== null) {
    console.log(JSON.stringify(ctx.request.header))
    const cookie = ctx.request.header.cookie
    if (cookie !== undefined && cookie !== null) {
      return superagent.get(`${opts.backendUrl}${url}`)
        .set('cookie', cookie)
    }
  }
  console.log(`GET ${url}, route[ ${opts.backendUrl}${url} ]`)
  return superagent.get(`${opts.backendUrl}${url}`)
}

const fetchPost = (ctx, url, opts) => {
  const request = ctx.request
  const contentType = request.headers.contenttype
  let sreq

  if (contentType === 'application/json') {
    console.log(`POST ${url}, route[ ${opts.backendUrl}${url} ], data[ ${JSON.stringify(request.body)} ]`)
    sreq = superagent.post(`${opts.backendUrl}${url}`)
      .set('Content-Type', 'application/json')
      .send(JSON.stringify(request.body))
  } else {
    // todo
    console.log(`POST ${url}, route[ ${opts.backendUrl}${url} ], data[ ${JSON.stringify(request.body)} ]`)
    sreq = superagent.post(`${opts.backendUrl}${url}`)
      .send(JSON.stringify(request.body))
  }

  return sreq
}

const fetchPut = (ctx, url, opts) => {
  const request = ctx.request
  const contentType = request.headers.contenttype
  let sreq

  if (contentType === 'application/json') {
    console.log(`PUT ${url}, route[ ${opts.backendUrl}${url} ], data[ ${JSON.stringify(request.body)} ]`)
    sreq = superagent.put(`${opts.backendUrl}${url}`)
      .set('Content-Type', 'application/json')
      .send(JSON.stringify(request.body))
  } else {
    // todo
    console.log(`PUT ${url}, route[ ${opts.backendUrl}${url} ], data[ ${JSON.stringify(request.body)} ]`)
    sreq = superagent.put(`${opts.backendUrl}${url}`)
      .send(JSON.stringify(request.body))
  }

  return sreq
}

const fetchDelete = (ctx, url, opts) => {
  console.log(`DELETE ${url}, route[ ${opts.backendUrl}${url} ]`)
  return superagent.delete(`${opts.backendUrl}${url}`)
}

const fetchApi = async (ctx, opts) => {
  const url = ctx.url
  const method = ctx.request.method
  let sreq
  if (method === 'GET') {
    sreq = fetchGet(ctx, url, opts)
  }
  if (method === 'POST') {
    sreq = fetchPost(ctx, url, opts)
  }
  if (method === 'PUT') {
    sreq = fetchPut(ctx, url, opts)
  }
  if (method === 'DELETE') {
    sreq = fetchDelete(ctx, url, opts)
  }

  const response = {}
  await sreq.then((res) => {
    if (res.type === 'text/plain') {
      response.body = res.text
    } else {
      response.body = res.body
    }
    response.status = res.status
  }).catch((err) => {
    response.message = err.message
    response.stack = err.stack
    response.status = err.status
  })
  return response
}

const sendGet = async (url, opts) => {
  const sreq = fetchGet(null, url, opts)
  const response = {}
  await sreq.then((res) => {
    response.body = res.body
    response.status = res.status
  }).catch((err) => {
    response.message = err.message
    response.stack = err.stack
    response.status = err.status
  })
  return response
}

module.exports = {
  fetchApi: fetchApi,
  sendGet: sendGet
}
