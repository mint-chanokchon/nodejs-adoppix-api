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
    const conn = await new Promise((resolve, reject) => {
        const mysqlConn = mysql.createConnection(mysqlConfigServer)
        mysqlConn.connect((err) => {
            if (err) {
                reject(err)
                return;
            }
        })
        resolve(mysqlConn)
    }).catch((err) => {
        throw new Error(err)
    })

    return conn
}

async function query(queryString, queryParams) {
    if (!queryString) throw new Error(`queryString shouldn't be null or undefined`)

    const mysqlConn = await connect().catch(err => { throw new Error(err) })
    const result = await new Promise((resolve, reject) => {
        mysqlConn.query(queryString, queryParams, (err, results, fields) => {
            if (err) {
                reject(err)
            } else {
                resolve(results)
            }
        })
    })

    return result
}

module.exports = query