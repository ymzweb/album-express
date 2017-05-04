const path = require('path')

// 每一个文件模块都有两个属性：__dirname 和 __filenamne
// __dirname 获取到的是当前文件所属目录的绝对路径
// __firname 获取到的是当前文件的绝对路径
module.exports = {
  port: 3000,
  host: '127.0.0.1',
  uploadDir: path.join(__dirname, 'uploads'),
  viewPath: path.join(__dirname, 'views'),
  viewExt: '.html'
}
