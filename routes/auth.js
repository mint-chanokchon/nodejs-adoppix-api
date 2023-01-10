const express = require('express')
const jwtAuth = require('../middlewares/jwtAuth')

const router = express.Router()

const authController = require('../controllers/auth')

router.get('/login', authController.login)
router.post('/register', authController.register)
router.get('/confirmEmail/:token', authController.confirmEmail)

router.use(jwtAuth.useAuthentication)

router.put('/changePassword', authController.changePassword)

module.exports = router