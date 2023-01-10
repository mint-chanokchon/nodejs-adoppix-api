const jwt = require('jsonwebtoken')

async function authentication(req, res, next) {
    let bearerToken = req.headers?.authorization
    if (!bearerToken) req.isAuth = false

    bearerToken = bearerToken.split(' ')
    if (bearerToken.length !== 2) return res.status(401).json({Status: false, Message: 'jwt token format invalid', Data: null })

    // get token
    const token = bearerToken[1]

    // get payload
    const user = await getPayload(token)

    // check token expire
    if (!isExpire(user.exp)) return res.status(401).json({Status: false, Message: 'jwt token is expire', Data: null})

    // send user payload to req
    req.user = user

    next()
}

function isExpire(exp) {
    const currentTime = Date.now() / 1000
    return exp < currentTime
}

async function getPayload(token) {
    const payload = await new Promise((resolve, reject) => {
        jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
            if (err) {
                reject(err)
            } else {
                resolve(decode)
            }
        })
    }).catch((err) => console.log(err))

    return payload
}

module.exports = authentication