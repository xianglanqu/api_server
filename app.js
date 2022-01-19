const express = require('express')
const app = express()
const joi = require('joi')

const cors = require('cors')
app.use(cors())
app.use(express.urlencoded({ extended: false }))

app.use((req, res, next) => {
    res.cc = function (err, status = 1) {
        res.send({
            status,
            message: err instanceof Error ? err.message : err,
        })
    }
    next()
})
//Configure the middleware that resolves tokens
const expressJWT = require('express-jwt')
const config = require('./config')
app.use(expressJWT({ secret: config.jwtSecretKey }).unless({ path: [/^\/api/] }))

const userRouter = require('./router/user')
const res = require('express/lib/response')
app.use('/api', userRouter)
const userinfoRouter = require('./router/userinfo')
app.use('/my', userinfoRouter)
//Import and use the routing module for article classification
const artCateRouter = require('./router/artcate')
app.use('/my/article', artCateRouter)

//Import and use the article's routing module
const articleRouter = require('./router/article')
app.use('/my/article', artCateRouter)

app.use(function (err, req, res, next) {
    if (err instanceof joi.ValidationError) return res.cc(err)
    if (err.name === 'UnauthorizedError') return res.cc('failed authorized')
    res.cc(err)
})
app.listen(3007, function () {
    console.log('api server running at http://127.0.0.1:3007');
})
