const express = require('express')
const fileUpload = require('express-fileupload') 
const cors = require('cors') 
const morgan = require('morgan') 
const bodyParser = require('body-parser') 
const path =require('path') // 用于获取文件拓展名
const os = require('os') // 用于获取 ip

const app = express()
const ip = '112.74.73.147'
const port = 80

app.listen(port, function(){ console.log(`listen ${ip}:${port}...`) })
app.use('/uploads',express.static('uploads/'))
app.use(fileUpload({ createParentPath: true }))
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(morgan('dev'))

app.get('/favicon.ico', (req, res) => {
  res.sendFile(path.join(__dirname, 'assets/favicon.ico'))
})

app.get('/', (req, res) => {
  res.setHeader('Content-Type', 'text/html')
  res.sendFile(path.join(__dirname, 'index.html'))
}) 

app.post('/upload', async (req, res) => {
  
  resData = []
  
  try {
    if(!req.files) {
      const status = 'error'
      const detail = 'No file uploaded'
      resData = [...resData, {status, detail}]
      res.status(403)
    } else{
      for (const key in req.files) {
        const files = req.files
        if (files[key] instanceof Array) {
          for (const key2 in files[key]) {
            const {md5, mv, name} = files[key][key2]
            mv('./uploads/' + md5 + path.extname(name))
            const status = 'succeed'
            const link = `http://${ip}:${port}/uploads/${md5}${path.extname(name)}`
            const detail = 'uploaded succeed'
            resData = [...resData, {status, link, detail}]
            res.status(200)
          }
        } else {
          const {md5, mv, name} = files[key]
          mv('./uploads/' + md5 + path.extname(name))
          const status = 'succeed'
          const link = `http://${ip}:${port}/uploads/${md5}${path.extname(name)}`
          const detail = 'uploaded succeed'
          resData = [...resData, {status, link, detail}]
          res.status(200)
        }
        
      }
    }
  } catch (err) {
    console.log(err)
    const status = 'update error'
    const detail = err + ''
    resData = [...resData, {status, detail}]
    res.status(500)
  }

  res.send(resData)
  
})
