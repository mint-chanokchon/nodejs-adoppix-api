const jwt = require('jsonwebtoken')

exports.configs = async (req, res, next) => {
    let bearerToken = req.headers?.authorization
    if (!bearerToken) {
        req.isAuth = false
        return next()
    }

    bearerToken = bearerToken.split(' ')
    if (bearerToken.length !== 2) return res.status(401).json({Status: false, Message: 'jwt token format invalid', Data: null })

    // get token
    const token = bearerToken[1]

    // get payload
    const user = await getPayload(token)

    // send user payload to req
    req.isAuth = true
    req.user = user

    next()
}

exports.useAuthentication = (req, res, next) => {
    // check user is auth
    if (!req.isAuth) return res.status(401).send({Status: false, Message: 'Unauthorize', Data: null})

    // check token expire
    if (isExpire(req.user.exp)) return res.status(401).send({Status: false, Message: 'Token expired', Data: null})

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