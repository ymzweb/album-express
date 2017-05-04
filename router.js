const express = require('express')
const handler = require('./handlers')

// 1. 创建路由对象
const router = express.Router()

// 2.3.4.... 设置路由

router
  .get('/',handler.showIndex)
  .get('/login',handler.showLogin)
  .get('/add',handler.doAdd)
  .get('/album', handler.showAlbum)
  .post('/album', handler.upload)

// latest：将路由对象 router 暴露出去
module.exports = router
