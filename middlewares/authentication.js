async function authentication(req, res, next) {
    let bearerToken = req.header?.authorization
    if (!bearerToken) req.isAuth = false

    next()
}

module.exports = authentication