//const mysqlContext = require('../DbContext/mysqlContext')
const userService = require('../services/user')

exports.login = (req, res, next) => {
    res.status(200).send()
}

exports.register = async (req, res, next) => {
    const email = req.body?.email
    const password = req.body?.password
    const adoppixId = req.body?.adoppixId

    if (!email && !password && !adoppixId) res.status(400).send({Status: false, Message: 'Some properties is undefined', Data: null})

    const user = await userService.findByEmailSync(email)
    if (user) res.status(404).json({Status: false, Message: 'Email aleady to use.', Data: null})

    await userService.createSync(email, password, adoppixId)

    res.status(201).json({Status: true, Message: 'Create successful', Data: null})
}