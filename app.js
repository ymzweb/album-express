const express = require('express')
const router = require('./router')
const config = require('./config')
const path = require('path')

// 这里就相当于 http.createServer
// express() 得到的实例对象就好比是原来的 server 实例对象
const app = express()

// 配置静态资源服务
app.use('/node_modules', express.static('./node_modules/'))
app.use('/public', express.static('./public/'))
app.use('/uploads', express.static('./uploads/'))

// 配置模板引擎
// 1. 配置模板文件存放的路径
//    该配置可以省略，因为 Express 默认就会去 views 目录中查找
app.set('views', path.join(__dirname, 'views'))
// 2. 设置 Express 要使用的模板引擎
app.set('view engine', 'ejs')

// 只要做了上面的配置
// 在以后的代码中就可以直接使用 res.render('index', { name: 'jack' })

// 加载路由系统
app
  .use(router)
  .listen(config.port, config.host, () => {
    console.log(`server is running at port ${config.port}`)
    console.log(`    Please visit http://${config.host}:${config.port}/`)
  })
