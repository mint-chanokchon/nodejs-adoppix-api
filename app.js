const express = require('express')
const cors = require('cors')
const jwtAuth = require('./middlewares/jwtAuth')

require('dotenv').config()

const app = express()

const authRoutes = require('./routes/auth')
const userRoutes = require('./routes/user')

app.use(express.json())
app.use(cors())

app.use(jwtAuth.configs)

app.use('/api/auth', authRoutes)
app.use('/api/user', userRoutes)

app.use((req, res, next) => {
    res.status(404).send()
})

const port = process.env.PORT
app.listen(port, () => {
    console.log(`Server start at http://localhost:${port}`)
})