const router = require('express').Router();
const bcrypt = require('bcryptjs');
const db = require('../data/db-config.js');
const userDb = require('../users/users-model');
const {generateToken} = require('./token.js');

router.post('/register', async (req, res) => {
    const user = {username, password, email, cohort} = req.body;
    console.log(user);
    for(let val in user){
        if(typeof user[val] === 'string'){
            user[val] = user[val].toLowerCase();
        } 
    };
   
    try{
        if(!(username && password)){
            throw 1
        }else if(!(/^[a-z][a-z0-9_]*$/i.test(username))){
            throw 2
        }

        const foundUsername = await db('users')
        .where({username: user.username})
        .first();

        if(foundUsername){
            throw 3
        }

        // if(email){
        //     const foundEmail = await db('users')
        //     .where({email: user.email})
        //     .first();

        //     if(foundEmail){
        //         throw 4
        //     }
        // }
        
        const [id] = await userDb.add({...user, password: bcrypt.hashSync(password, 8)});

        const response = await db('users').select('id', 'username').where({id}).first();

        res.status(201).json({id :response.id, username: response.username});
    }catch(err){
        if(err === 1){
            res.status(400).json({message: `Username and password is required.`});
        }else if(err === 2){
            res.status(400).json({message: 'Username must only contain characters A-Z, _, and 0-9. Username must start with a letter.'});
        }else if(err === 3){
            res.status(422).json({message: `Username '${user.username}' is already in use.`});
        // }else if(err === 4){
        //     res.status(422).json({message: `There is already an account associated with that email`});
        }else{
            console.log(err);
            res.status(500).json({message: 'Server could not add user'});
        }
        
    }
});

router.post('/login', async (req, res) => {
    const {username, password} = req.body;
    if(username && password){
        const user = await db('users as u').where({'u.username': username.toLowerCase()})
            .leftJoin('profile_pictures as p', 'u.id', 'p.user_id')
            .select('u.*', 'p.url')
            .first();
        if(user && bcrypt.compareSync(password, user.password)){
            const token = await generateToken(user);
            res.status(200).json({message: `Welcome ${username.toLowerCase()}`, token, user: {...user, password: undefined}});
        }else{
            res.status(403).json({message: 'Invalid username or password'});
        }
    }else{
        res.status(400).json({message: 'Please provide a username and password'});
    }
});

module.exports = router;