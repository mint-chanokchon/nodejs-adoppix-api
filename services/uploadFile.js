const Ftp = require('ftp')
require('dotenv').config()

const config = { host: undefined, user: undefined, password: undefined }

exports.usePublic = () => {
    config.host = process.env.PUBLIC_FTP_HOST
    config.user = process.env.PUBLIC_FTP_USER
    config.password = process.env.PUBLIC_FTP_PASS
    
    return { upload: upload }
}

function upload(fileBuffer, fileName) {
    // check config
    if (!config.host || !config.user || !config.password) throw new Error('please config usePublic or usePrivate')

    // create instance of ftp
    const ftp = new Ftp()
    ftp.connect(config)

    // when instance is ready
    ftp.on('ready', () => {
        // upload with array buffer
        ftp.put(Buffer.from(fileBuffer), `${fileName}`, (err) => {
            if (err) throw new Error(err)
            ftp.end()
        })
    })
}