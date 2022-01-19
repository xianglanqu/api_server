const db = require("../db/index")
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('../config')

exports.regUser = function (req, res) {
    const userinfo = req.body

    // if (!userinfo.username || !userinfo.password) {
    //     return res.send({
    //         status: 1, message: 'username or password can not null'
    //     })
    // }

    const sqlStr = 'select * from ev_users where username = ?'
    db.query(sqlStr, userinfo.username, function (err, results) {

        if (err) {
            //   return res.send({ status: 1, message: err.message })
            return res.cc(err)
        }
        if (results.length > 0) {
            // return res.send({ status: 1, message: 'please change another username' })
            return res.cc('please change another username')
        }

        userinfo.password = bcrypt.hashSync(userinfo.password, 10)
        const sql = 'insert into ev_users set ?'
        db.query(sql, { username: userinfo.username, password: userinfo.password }, function (err, results) {
            if (err)
                // return res.send({ status: 1, message: err.message })
                return res.cc(err)
            if (results.affectedRows !== 1)
                //    return res.send({ status: 1, message: 'failed try again' })
                return res.cc('failed try again later')
            //res.send({ status: 0, message: 'success!' })
            res.cc('success!', 0)
        })


    })
}
//return res.send('reguser OK')
exports.login = function (req, res) {
    const userinfo = req.body
    const sql = 'select * from ev_users where username=?'
    db.query(sql, userinfo.username, function (err, results) {
        if (err) return res.cc(err)
        if (results.length !== 1) return res.cc('failed login in')

        //Check whether the password is correct
        const compareResult = bcrypt.compareSync(userinfo.password, results[0].password)
        if (!compareResult) return res.cc('wrong password')

        //res.send('login in OK')
        const user = { ...results[0], password: '', user_pic: '' }
        const tokenStr = jwt.sign(user, config.jwtSecretKey, { expiresIn: config.expiresIn })
        res.send({
            status: 0,
            message: 'success login',
            token: 'Bearer ' + tokenStr,
        })
    })

}