// require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
// const db = require('./data/db-config.js')

const authenticate = require('./auth/authenticate-middleware.js');
const authRouter = require('./auth/auth-router.js');
const userRouter = require('./users/users-router.js');
const userRouter = require('./farms/farms-router.js');

const server = express();

server.use(helmet());
server.use(cors());
server.use(express.json());

server.use('/api/auth', authRouter);
server.use('/api/users', authenticate, userRouter);
server.use('/api/farms', authenticate, userRouter);

server.get('/', (req, res) => {
    res.status(200).json({message: 'hi'});
});

module.exports = server;
