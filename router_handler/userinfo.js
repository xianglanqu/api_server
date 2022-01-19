//Import the database operation module
const db = require('../db/index')

const bcrypt = require('bcryptjs')
const { func } = require('joi')


exports.getUserInfo = function (req, res) {
    const sql = 'select id, username, nickname, email,user_pic from ev_users where id=?'

    db.query(sql, req.user.id, function (err, results) {
        if (err) return res.cc(err)
        if (results.length !== 1) return res.cc('Failed to obtain user information')
        res.send({
            status: 0,
            message: 'successful to obtain user information',
            data: results[0],
        })
    })
}

//A handler that updates the user's basic information
exports.updateUserInfo = function (req, res) {
    const sql = 'update ev_users set ? where id=?'
    db.query(sql, [req.body, req.body.id], function (err, results) {
        if (err) return res.cc(err)
        if (results.affectedRows !== 1) return res.cc('Failed to update basic user information')
        res.cc('The basic information of the user is updated successfully')
    })
}

exports.updatePassword = function (req, res) {
    const sql = 'select * from ev_users where id =?'
    db.query(sql, req.user.id, function (err, results) {
        if (err) return res.cc(err)
        if (results.length !== 1) return res.cc('User does not exist')
        const compareResult = bcrypt.compareSync(req.body.oldPwd, results[0].password)
        if (!compareResult) return res.cc('Old password error')

        const sql = 'update ev_users set password = ? where id=?'
        const newPwd = bcrypt.hashSync(req.body.newPwd, 10)
        db.query(sql, [newPwd, req.user.id], function (err, results) {
            if (err) return res.cc(err)
            if (results.affectedRows !== 1) return res.cc('Failed to update password')
            res.cc('update password successfully', 0)
        })
    })
}

//Change avatar function
exports.updateAvatar = function (req, res) {
    const sql = 'update ev_users set user_pic=? where id=?'
    db.query(sql, [req.body.avatar, req.user.id], function (err, results) {
        if (err) return res.cc(err)
        if (results.affectedRows !== 1) return res.cc('Failed to change profile picture')
        res.cc('Succeeded in changing the profile picture', 0)
    })
}