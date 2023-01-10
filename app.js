const express = require('express')
const cors = require('cors')
const authentication = require('./middlewares/authentication')

require('dotenv').config()

const app = express()

const authRoutes = require('./routes/auth')

app.use(express.json())
app.use(cors())

app.use(authentication)

app.use('/api/auth', authRoutes)

app.use((req, res, next) => {
    res.status(404).send()
})

const port = process.env.PORT
app.listen(port, () => {
    console.log(`Server start at http://localhost:${port}`)
})