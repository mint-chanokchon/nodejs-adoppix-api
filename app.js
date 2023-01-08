const express = require('express')
const mysqlContext = require('./DbContext/mysqlContext')
require('dotenv').config()

const app = express()

app.use(async (req, res, next) => {
    await mysqlContext().catch(err => console.log(err))
    next()
})

const port = process.env.PORT
app.listen(port, () => {
    console.log(`Server start at http://localhost:${port}`)
})