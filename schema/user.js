const { required } = require('joi')
const joi = require('joi')
const username = joi.string().alphanum().min(3).max(10).required()
const password = joi.string().pattern(/^[\S]{6,12}$/).required()

const id = joi.number().integer().min(1).required()
const nickname = joi.string().required()
const email = joi.string().email().required()
const avatar = joi.string().dataUri().required()

exports.reg_login_schema = {
    body: {
        username,
        password,
    }
}
exports.update_userinfo_schema = {
    body: {
        id: id,
        nickname: nickname,
        email: email,
    }
}

//Validation rule object ————Update password
exports.update_password_schema = {
    body: {
        oldPwd: password,
        newPwd: joi.not(joi.ref('oldPwd')).concat(password),
    },
}

//Defines the authentication rules for validating Avatars
exports.update_avatar_schema = {
    body: {
        avatar
    }
}
