const jwt = require('jsonwebtoken');
const db = require('../data/db-config');

const secret = process.env.JWT_SECRET;

async function generateToken(user){
    const payload = {
        subject: user.id,
    };

    const admin = await db('users as u')
        .where({username: user.username})
        .join('admins as a', 'u.id', 'a.user_id')
        .first();
    if(admin){
        payload['admin'] = true;
    }

    const options = {
        expiresIn: "24h"
    };

    return jwt.sign(payload, secret, options);
}

module.exports = {
    secret,
    generateToken
}