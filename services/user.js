const bcrypt = require('bcrypt')
const uuid = require('uuidv4').uuid

const mysqlQuery = require('../DbContext/mysqlContext')

exports.createSync = async (email, password, adoppixId) => {
    if (!email && !password && !adoppixId) throw new Error('Some parameters is undefined')
    
    const userId = uuid()
    const passwordSalt = await bcrypt.genSaltSync(10)
    const passwordHash = await bcrypt.hashSync(password, passwordSalt)
    const emailConfirm = false
    const created = new Date()
    const updated = new Date()
    const isActive = true
    const userRoleId = 2

    const queryString = `INSERT INTO users 
    (id, email, email_confirm, password_hash, password_salt, created, updated, is_active, user_roles_id) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
    const queryParams = [userId, email, emailConfirm, passwordHash, passwordSalt, created, updated, isActive, userRoleId]
    await mysqlQuery(queryString, queryParams).catch((err) => { throw new Error(err) })
}

exports.findByEmailSync = async (email) => {
    if (!email) throw new Error(`email shouldn't be null or undefined`) 

    const query = `SELECT * FROM users WHERE email = ?`
    const user = mysqlQuery(query, [email]).catch((err) => { throw new Error(err) })

    return user
} 