const mysql = require('mysql')
require('dotenv').config()

const mysqlConfigServer = {
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    port: process.env.MYSQL_PORT,
    database: process.env.MYSQL_DATABASE
}

async function connect() {
    const connection = await new Promise((resolve, reject) => {
        mysql.createConnection(mysqlConfigServer)
            .connect((err) => {
                if (err) {
                    reject(err)
                } else {
                    resolve()
                }
            })
    }).catch((err) => {
        throw new Error(err)
    })

    console.log('MySql connect successful.')

    return connection
}

module.exports = connect