const express = require('express')
const multer = require('multer')

const upload = multer()

const auctionController = require('../controllers/auction')

const router = express.Router()

router.post('/', 
    [upload.array('images')],
    auctionController.create)

module.exports = router