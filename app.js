// 读取配置
const configs = require('./config.js')

const opts = configs()

const Koa = require('koa')

const app = new Koa()

// 设置POST body解析
const bodyParser = require('koa-bodyparser')

app.use(bodyParser())

// 配置页面渲染
const render = require('./server/render.js')

app.use(render(`${__dirname}/app/views`, opts))

// 增加请求监听
const monitor = require('./server/monitor.js')

app.use(monitor(opts))

// 增加后端接口转发
const apiRouter = require('./server/api_router.js')

app.use(apiRouter(opts))

// 静态文件拦截
const staticFilter = require('./server/static_filter.js')

app.use(staticFilter('/static/', `${__dirname}/app/static/`))

// 注入controller
const mappings = require('./server/mapping.js')

app.use(mappings(`${__dirname}/app/controller`))

const viewBinddings = require('./server/view_bind.js')

// 注入页面请求
const viewMappings = require('./server/view_mapping.js')

app.use(viewMappings(`${__dirname}/app/views`, viewBinddings(`${__dirname}/app/resources`), opts))

// 启动
app.listen(opts.server.port, () => {
  console.log(`uc_front demo start at port ${opts.server.port}!`)
})
