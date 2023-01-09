//const mysqlContext = require('../DbContext/mysqlContext')
const authService = require('../services/user')

exports.login = (req, res, next) => {
    res.status(200).send()
}

exports.register = async (req, res, next) => {
    const email = req.body.email

    if (!email) res.status(400).send()

    const user = await authService.findByEmail(email)
    console.log(user)

    res.status(200).send()
}