//This is the route handler module


const db = require('../db/index')
//Gets a handler for the list of article categories
exports.getArtCates = function (req, res) {
    const sql = 'select * from ev_article_cate where is_delete = 0 order by id asc'

    db.query(sql, function (err, results) {
        if (err) return res.cc(err)
        res.send({
            status: 0,
            message: 'Succeeded in obtaining the article classification data',
            data: results,
        })
    })
}

exports.addArticleCates = function (req, res) {
    const sql = 'select * from ev_article_cate where name=? or alias=?'
    db.query(sql, [req.body.name, req.body.alias], function (err, results) {
        if (err) return res.cc(err)
        if (results.length === 2) return res.cc('The category name and alias are occupied. Please change them and try again')
        if (results.length === 1 && results[0].name === req.body.name && results[0].alias === req.body.alias)
            return res.cc('The category name and alias are occupied. Please change them and try again')
        if (results.length === 1 && results[0].name === req.body.name)
            return res.cc('The category name is occupied. Change it and try again')
        if (results.length === 1 && results[0].alias === req.body.alias)
            return res.cc('The category alias is occupied. Please change it and try again')

        const sql = 'insert into ev_article_cate set ?'

        db.query(sql, req.body, function (err, results) {
            if (err) return res.cc(err)
            if (results.affectedRows !== 1) return res.cc('New article classification failed')
            res.cc('New article classification succeeded')
        })
    })
}

exports.deleteCateById = function (req, res) {
    const sql = 'update ev_article_cate set is_delete=1 where id=?'
    db.query(sql, req.params.id, function (err, results) {
        if (err) return res.cc(err)
        if (results.affectedRows !== 1) return res.cc('Failed to delete the article category')
        res.cc('Succeeded to delete the article category')
    })
}

exports.getArtCateById = function (req, res) {
    const sql = 'select * from  ev_article_cate where id=?'
    db.query(sql, req.params.id, function (err, results) {
        if (err) return res.cc(err)
        if (results.length !== 1) return res.cc('Failed to get article classification data')
        res.cc({
            status: 0,
            message: 'Succeeded to get the article classification data',
            data: results[0],
        })
    })
}

exports.updateCateById = function (req, res) {
    const sql = 'select * from  ev_article_cate where id<>? and(name=? or alias=?)'
    db.query(sql, [req.body.Id, req.body.name, req.body.alias], function (err, results) {
        if (err) return res.cc(err)
        if (results.length === 2)
            return res.cc('The category name and alias are occupied. Please change them and try again')
        if (results.length === 1 && results[0].name === req.body.name && results[0].alias === req.body.alias)
            return res.cc('The category name and alias are occupied. Please change them and try again')
        if (results.length === 1 && results[0].name === req.body.name)
            return res.cc('The category name is occupied. Please change them and try again')
        if (results.length === 1 && results[0].alias === req.body.alias)
            return res.cc('The alias is occupied. Please change them and try again')
        const sql = 'update ev_article_cate set ? where id=?'
        db.query(sql, [req.body, req.body.Id], function (req, res) {
            if (err) return res.cc(err)
            if (results.affectedRows !== 1) return res.cc('Failed to update article classification data')
            res.cc('Succeeded to update article classification data', 0)
        })
    })
}