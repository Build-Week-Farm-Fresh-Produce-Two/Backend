const express = require('express');
const db = require('./data/db-config.js')
const cors = require('cors');
const helmet = require('helmet');

// const authenticate = require('../auth/authenticate-middleware.js');
// const authRouter = require('../auth/auth-router.js');
// const userRouter = require('../users/user-router');
// const jokesRouter = require('../jokes/jokes-router.js');

const server = express();


  

// const corsConfig = {
//     origin: 'http://localhost:3002',
//     credentials: true,
// }
server.use(helmet());
server.use(cors());
server.use(express.json());

// server.use('/api/auth', authRouter);
// server.use('/api/users',authenticate, userRouter)
// server.use('/api/jokes', authenticate, jokesRouter);


server.get('/', (req, res) => {
    res.status(200).json({message: 'hi'});
});

module.exports = server;
