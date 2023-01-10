const userService = require('../services/user')
const emailService = require('../services/email')
const e = require('cors')

exports.login = async (req, res, next) => {
    const email = req.body?.email
    const password = req.body?.password

    if (!email || !password) return res.status(400).send({Status: false, Message: 'Some properties is undefined', Data: null})

    const user = await userService.findByEmailSync(email).catch((err) => { throw new Error(err) })
    if (!user) return res.status(400).json({Status: false, Message: 'Email or Password invalid', Data: null})

    if (!user.email_confirm) return res.status(400).json({Status: false, Message: 'Email not confirm', Data: null})

    if (!await userService.validatePasswordSync(password, user.password_hash)) return res.status(400).json({Status: false, Message: 'Email or Password invalid', Data: null})

    const profile = await userService.findProfileById(user.id)
    console.log(profile)
    const token = await userService.genJwtToken({ email: user.email, username: profile.username })
    res.status(200).json({Status: false, Message: 'Some properties is undefined', Data: token})
}

exports.register = async (req, res, next) => {
    const email = req.body?.email
    const password = req.body?.password
    const adoppixId = req.body?.adoppixId

    if (!email || !password || !adoppixId) {
        res.status(400).send({Status: false, Message: 'Some properties is undefined', Data: null})
        return
    }

    const user = await userService.findByEmailSync(email)
    if (user) {
        res.status(404).json({Status: false, Message: 'Email aleady to use.', Data: null})
        return
    }

    // create user
    const userId = await userService.createSync(email, password, adoppixId)

    // send confirm email
    const emailToken = await userService.genEmailToken(userId)
    await emailService.sendSync(email, 'Confirm your email', `<a href='http://localhost:3000/api/auth/confirmEmail/${emailToken}'>Click</a>`)

    res.status(201).json({Status: true, Message: 'Create successful', Data: null})
}

exports.confirmEmail = async (req, res, next) => {
    const token = req.params?.token
    
    // check token is undefined
    if (!token) return res.status(404).json({Status: false, Message: 'Token is undefined', Data: null})

    // check token is invalid
    const userId = await userService.verifyEmailToken(token)
    if (!userId) return res.status(404).json({Status: false, Message: 'Token invalid', Data: null})

    // update email to comfirm
    await userService.updateStatusEmail(userId, true)
    
    res.status(200).json({Status: true, Message: 'Confirm email successful', Data: null})
}