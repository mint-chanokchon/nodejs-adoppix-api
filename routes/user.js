const express = require('express')
const jwtAuth = require('../middlewares/jwtAuth')

const router = express.Router()

const userController = require('../controllers/user')

router.use(jwtAuth.verify)

router.get('/:username/profile', userController.getProfile)

module.exports = router