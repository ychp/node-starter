
const opts = () => {
  const prodOpts = require('./sky-prod.js')
  if (process.env.NODE_ENV === 'prod') {
    return prodOpts
  }
  const defaultOpts = require('./sky.js')
  for (const { key, value } of defaultOpts) {
    prodOpts[key] = value
  }
  return prodOpts
}

module.exports = opts
