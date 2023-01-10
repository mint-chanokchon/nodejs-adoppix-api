const mysqlQuery = require('../DbContext/mysqlContext')

exports.getProfile = (req, res, next) => {
    const username = req.params?.username

    console.log(username)

    res.status(200).json({ Message: 'Successful' })
}