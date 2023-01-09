const express = require('express')

const router = express.Router()

const authController = require('../controllers/auth')

router.get('/login', authController.login)
router.post('/register', authController.register)
router.get('/confirmEmail/:token', authController.confirmEmail)

module.exports = router