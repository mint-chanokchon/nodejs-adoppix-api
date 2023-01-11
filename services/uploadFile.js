const Ftp = require('ftp')
require('dotenv').config()

const ftp = new Ftp()

const config = { host: undefined, user: undefined, password: undefined }

exports.usePublic = () => {
    config.host = '119.59.96.90'
    config.user = 'adopcloud_public'
    config.password = 'Dpl3j^593'
    console.log(process.env.SMTP_PORT)
}

exports.upload = () => {
    console.log(config)
    if (!config.host || !config.user || !config.password) throw new Error('please config usePublic or usePrivate')
    
    ftp.connect(config)

    ftp.on('ready', () => {

    })
}