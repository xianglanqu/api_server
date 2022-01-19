const express = require('express')
const router = express.Router()
const router_handler = require('../router_handler/user')

const expressJoi = require('@escook/express-joi')
const { reg_login_schema } = require('../schema/user')
//create new users
router.post('/reguser', expressJoi(reg_login_schema), router_handler.regUser)

//
router.post('/login', expressJoi(reg_login_schema), router_handler.login)
module.exports = router