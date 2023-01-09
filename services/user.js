const mysqlQuery = require('../DbContext/mysqlContext') 

exports.create = () => {

}

exports.findByEmail = async (email) => {
    if (!email) throw new Error(`email shouldn't be null or undefined`) 

    const query = `SELECT * FROM users WHERE email = ?`
    const user = mysqlQuery(query, [email]).catch((err) => { throw new Error(err) })

    return user
} 