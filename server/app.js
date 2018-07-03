const express = require("express")
const app = express()
const path = require("path")

app.use('/user', require('./Routes/User'))
app.use('/Assets', express.static(path.join(__dirname, './Static/Assets')))
app.use(express.static(path.join(__dirname, '../dist')))

module.exports = app