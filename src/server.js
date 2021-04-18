const express = require("express")
const server = express()
const routes = require("./routes")
const path = require("path")

// usando template engine
server.set('view engine',  'ejs')

// localizando pasta views
server.set('views', path.join(__dirname, 'views'))

// habilitando arquivos statics
server.use(express.static("public"))

// usando o req.body
server.use(express.urlencoded({ extended: true }))

server.use(routes)

server.listen(3000, () => console.log('Backend Started! :D'))