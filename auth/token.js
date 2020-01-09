const jwt = require('jsonwebtoken');

const secret = process.env.JWT_SECRET;

async function generateToken(user){
    const payload = {
        subject: user.id,
        farmID: user.farmID,
    };

    const options = {
        expiresIn: "300h"
    };

    return jwt.sign(payload, secret, options);
}

module.exports = {
    secret,
    generateToken
}