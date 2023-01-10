const bcrypt = require('bcrypt')
const uuid = require('uuidv4').uuid
const jwt = require('jsonwebtoken')

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

    // create users
    let queryString = `INSERT INTO users 
    (id, email, email_confirm, password_hash, password_salt, created, updated, is_active, user_roles_id) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
    const queryParams = [userId, email, emailConfirm, passwordHash, passwordSalt, created, updated, isActive, userRoleId]
    await mysqlQuery(queryString, queryParams).catch((err) => { throw new Error(err) })

    // create user_profiles
    queryString = `INSERT INTO user_profiles (users_id, username) VALUES (?, ?)`
    await mysqlQuery(queryString, [userId, adoppixId]).catch((err) => { throw new Error(err) })

    return userId
}

exports.findByEmailSync = async (email) => {
    if (!email) throw new Error(`email shouldn't be null or undefined`) 

    const query = `SELECT * FROM users WHERE email = ?`
    const user = mysqlQuery(query, [email]).catch((err) => { throw new Error(err) })

    return user
} 

exports.validatePasswordSync = async (password, passwordHash) => {
    if (!password || !passwordHash) throw new Error('Some properties is undefined')

    const result = bcrypt.compareSync(password, passwordHash)
    return result
}

exports.genJwtToken = async (claims) => {
    const token = jwt.sign(claims, process.env.JWT_SECRET, { algorithm: 'HS256', expiresIn: '24h' })
    return token
}

exports.genEmailToken = async (userId) => {
    const token = uuid()
    const queryString = `UPDATE users SET email_token = ? WHERE id = ?`
    await mysqlQuery(queryString, [token, userId]).catch((err) => { throw new Error(err) })
    return token
}

exports.verifyEmailToken = async (token) => {
    const queryString = `SELECT id FROM users WHERE email_token = ?`
    const user = await mysqlQuery(queryString, [token]).catch((err) => { throw new Error(err) })

    if (!user) return undefined

    return user.id
}

exports.updateStatusEmail = async (userId, status) => {
    const queryString = `UPDATE users SET email_confirm = ?, email_token = null WHERE id = ?`
    await mysqlQuery(queryString, [status, userId]).catch((err) => { throw new Error(err) })
}

exports.findProfileByUsername = async (username) => {
    if (!username) throw new Error('username is require')

    const queryString = `SELECT description, profile_img, cover_img, is_dark FROM user_profiles WHERE username = ?`
    const userProfile = await mysqlQuery(queryString, [username]).catch((err) => { throw new Error(err) })

    return userProfile
}