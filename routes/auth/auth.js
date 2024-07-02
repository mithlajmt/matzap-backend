const express = require('express')
const router = express.Router()
const {
    validateUserData,
} = require('./../../controllers/authController')

router.post('/signup',[
    validateUserData,
])

module.exports = router