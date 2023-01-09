const userService = require('../services/user')
const emailService = require('../services/email')

exports.login = async (req, res, next) => {
    const email = req.body?.email
    const password = req.body?.password

    if (!email || !password) {
        res.status(400).send({Status: false, Message: 'Some properties is undefined', Data: null})
        return;
    }

    const user = await userService.findByEmailSync(email).catch((err) => { throw new Error(err) })
    if (!user) res.status(400).json({Status: false, Message: 'Email or Password invalid', Data: null})

    if (!user.email_confirm) console.log('Email not confirm')

    if (!await userService.validatePasswordSync(password, user.password_hash)) {
        res.status(400).json({Status: false, Message: 'Email or Password invalid', Data: null})
        return;
    }

    const token = await userService.genJwtToken({ email: user.email })
    res.status(200).json({Status: false, Message: 'Some properties is undefined', Data: token})
}

exports.register = async (req, res, next) => {
    const email = req.body?.email
    const password = req.body?.password
    const adoppixId = req.body?.adoppixId

    if (!email || !password || !adoppixId) {
        res.status(400).send({Status: false, Message: 'Some properties is undefined', Data: null})
    }

    const user = await userService.findByEmailSync(email)
    if (user) res.status(404).json({Status: false, Message: 'Email aleady to use.', Data: null})

    // create user
    await userService.createSync(email, password, adoppixId)

    // send mail
    /********** */

    res.status(201).json({Status: true, Message: 'Create successful', Data: null})
}