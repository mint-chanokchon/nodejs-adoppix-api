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
    if (!await userService.verifyPasswordSync(password, user.password_hash)) return res.status(400).json({Status: false, Message: 'Email or Password invalid', Data: null})
    const profile = await userService.findProfileById(user.id)
    const token = await userService.genJwtToken({ userId: user.id, email: user.email, username: profile.username })
    res.status(200).json({Status: false, Message: 'Some properties is undefined', Data: token})
}

exports.register = async (req, res, next) => {
    const email = req.body?.email
    const password = req.body?.password
    const adoppixId = req.body?.adoppixId
    if (!email || !password || !adoppixId) return res.status(400).send({Status: false, Message: 'Some properties is undefined', Data: null})
    const user = await userService.findByEmailSync(email)
    if (user) return res.status(404).json({Status: false, Message: 'Email aleady to use.', Data: null})
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

exports.changePassword = async (req, res, next) => {
    const userId = req.user.userId
    const currentPassword = req.body?.currentPassword
    const newPassword = req.body?.newPassword
    if (!userId || !currentPassword || !newPassword) return res.status(400).json('Some properties is undefined')
    const user = await userService.findByIdSync(userId)
    if (!user) return res.status(400).json({ Status: false, Message: 'User not found', Data: null })
    // verify old password
    if (!await userService.verifyPasswordSync(currentPassword, user.password_hash)) return res.status(400).json({ Status: false, Message: 'Password invalid', Data: null }) 
    // set new password
    await userService.updatePassword(userId, newPassword)
    res.status(200).json({Status: true, Message: 'Change password successful', Data: null})
}