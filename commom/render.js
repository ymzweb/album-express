const fs = require('fs')
const _ = require('underscore')
const path = require('path')
const config = require('config')

module.exports = function(res) {
  res.render = function(viewName, obj = {}) {
    const viewPath = `${path.join(config.viewPath, viewName)}${config.viewExt}`
    fs.readFile(viewPath, 'utf8', (err, data) => {
      if (err) {
        throw err
      }
      const htmlStr = _.template(data)(obj)
        // 将 htmlStr 响应给客户端
      res.end(htmlStr)
    })
  }
}
