const fs = require('fs')
const config = require('./config')
const path = require('path')
const formidable = require('formidable')

/**
 * GET /
 */
exports.showIndex = (req, res) => {
  fs.readdir(config.uploadDir, (err, files) => {
    if (err) {
      throw err
    }

    let albums = []

    files.forEach(item => {
      const currentPath = path.join(config.uploadDir, item)
      if (fs.statSync(currentPath).isDirectory()) {
        albums.push(item)
      }
    })
    res.render('index', {
      albumNames: albums
    })
  })
}

/**
 * GET /album?albumName=xxx
 */
exports.showAlbum = (req, res) => {
  const albumName = req.query.albumName
  console.log(albumName)
  const albumPath = path.join(config.uploadDir, albumName)
  fs.readdir(albumPath, (err, files) => {
    if (err) {
      throw err
    }
    files = files.map(fileName => fileName = `${albumName}/${fileName}`)
    res.render('album', {
      imgPaths: files,
      albumName: albumName
    })
  })
}

/**
 * GET /getAlbums
 */
exports.getAlbums = (req, res) => {
  // 将相册目录 uploads 目录下所有的目录名称读取出来响应给客户端
  // 这里将相册目录放到配置文件中的目的是为了防止以后要改变相册目录
  // 假如这里使用 ./uploads 目录的形式，在添加相册中，也使用 ./uploads 目录形式
  // 这样的话一旦要修改相册目录，就要改好几个地方
  // 所以将这个路径放到配置文件中，所有使用该路径的地方都通过这个配置文件来获取就可以了
  // 这样以后假设要修改相册的目录了，只需要将配置文件改一下就可以了。
  // 总而言之：就是把可能变化的以及多个地方都使用的一些内容给放到配置文件中，方便维护和修改
  fs.readdir(config.uploadDir, (err, files) => {
    if (err) {
      throw err
    }

    let albums = []

    files.forEach(item => {
      const currentPath = path.join(config.uploadDir, item)
      if (fs.statSync(currentPath).isDirectory()) {
        albums.push(item)
      }
    })

    res.writeHead(200, {
      'Content-Type': 'text/plain; charset=utf-8'
    })

    // 将数组转成 json 格式字符串，响应给客户端
    // JSON.stringify 可以将一个 json 对象转换为 json 格式字符串
    // es6 中，如果一个对象的属性名和值引用的变量名是一样的，可以直接省略写一个即可
    res.end(JSON.stringify({
      albums
    }))
  })
}

/**
 * GET /add?albumName=xxx
 */
exports.doAdd = (req, res) => {
  const albumName = req.query.albumName
  if (albumName.trim().length === 0) {
    res.writeHead(200, {
      'Content-Type': 'text/plain; charset=utf-8'
    })
    return res.end('小眼儿，请输入完整的相册名称')
  }


  fs.readdir(config.uploadDir, (err, files) => {
    if (err) {
      throw err
    }
    let albums = []
    files.forEach(item => {
      const currentPath = path.join(config.uploadDir, item)
      if (fs.statSync(currentPath).isDirectory()) {
        albums.push(item)
      }
    })

    if (albums.find(item => item === albumName)) {
      return res.send('albumname already exists.')
    }

    // 代码执行到这里，说明可以新建相册目录了
    fs.mkdir(path.join(config.uploadDir, albumName), err => {
      if (err) {
        throw err
      }
      // 当添加相册成功之后，跳转到首页，刷新
      res.redirect('/')
    })
  })
}

/**
 * GET /xxx
 */
exports.handle404 = (req, res) => {
  res.end('404 Not Found.')
}

/**
 * GET /login
 */
exports.showLogin = (req, res) => {
  res.render('login', {
    name: 'login'
  })
}

/**
 * POST /login
 * body { username: xxx, password: xxx }
 */
exports.doLogin = (req, res) => {
  // 使用Node接收解析表单 POST 提交的数据
  // 1. 监听 req 对象的 data 和 end 事件
  let body = ''
  req.on('data', data => {
    body += data
  })
  req.on('end', () => {
    console.log(qstring.parse(body))
  })
}

/**
 * POST /album?albumName=xxx
 * body: { image: Object }  注意：这里的 body 请求体就是文件对象
 */
exports.upload = (req, res) => {
  const albumName = req.query.albumName

  // formidable 文件处理包
  const form = new formidable.IncomingForm()

  // 配置 formidable 接收文件的保存路径
  form.uploadDir = path.join(config.uploadDir, albumName)

  // 默认 formidable 对于上传的文件会改名并且不包含扩展名
  // 下面这个代码可以让它继续保持扩展名
  form.keepExtensions = true

  // 限制用户上传文件的大小，单位是 字节
  form.maxFieldsSize = 5 * 1024 * 1024

  form.parse(req, (err, fields, files) => {
    if (err) {
      throw err
    }
    res.redirect(`/album?albumName=${encodeURI(albumName)}`)
  })
}
