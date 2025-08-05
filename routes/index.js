const express = require('express')
const router = express.Router()
const {halamanIndex} = require('../controllers/indexController')
const verifyToken = require('../middleware/authMiddleware')

router.get('/', verifyToken, halamanIndex)

module.exports = router