const express = require('express')

const auctionController = require('../controllers/auction')

const router = express.Router()

router.post('/create', auctionController.create)

module.exports = router