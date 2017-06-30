
const index = async (ctx) => {
  ctx.render('index.html')
}

module.exports = {
  'GET /': index
}
