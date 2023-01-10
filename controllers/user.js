const userService = require('../services/user')

exports.getProfile = async (req, res, next) => {
    const username = req.params?.username

    if (!username) return res.status(400).json({ Status: false, Message: 'username is required', Data: null })

    const profile = await userService.findProfileByUsername(username).catch((err) => console.log(err))
    if (!profile) return res.status(404).json({ Status: false, Message: 'Profile not found', Data: null })

    profile.username = username
    res.status(200).json({ Status: true, Message: 'Successful', Data: profile })
}