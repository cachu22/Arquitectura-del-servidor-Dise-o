import jwt from 'jsonwebtoken'

export const PRIVATE_KEY = 'coder-secret'

export const generateToken = user => jwt.sign(user, PRIVATE_KEY, {expiresIn: '24h'})