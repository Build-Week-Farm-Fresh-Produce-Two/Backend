const router = require('express').Router();
const bcrypt = require('bcryptjs');
const userDb = require('./users-model');

const db = require('../data/db-config');

// get by token
router.get('/user', async (req, res) => {
    try{
        const user = await db('users as u')
            .where({'u.id': req.user.id})
            .select('u.*')
            .first();
        if(user){
            res.status(200).json(user)
        }else{
            console.log('get user 404 error', user);
            res.status(404).json({message: `User with id ${req.user.id} not found.`});
        }
        
    }catch(err){
        console.log(err);
        res.status(500).json({message: 'Error getting user information.'});
    }
});

router.get('/:id', async (req, res) => {
    try{
        const user = await userDb.findById(req.params.id);
        if(user){
            res.status(200).json(user);
        }else{
            throw 404;
        }
    }catch(err){
        console.log(err);
        switch(err){
            case 404: res.status(404).json({message: 'User with specified ID not found'});
                break;
            default: res.status(500).json({message: 'Error getting user information'});
                break;
        }
    }
});

router.put('/user', async (req, res) => {
    // const {email, name} = req.body;
    const newValues = req.body;
    Object.keys(newValues).forEach(key => newValues[key] === undefined && delete newValues[key])
    
    // for(let val in newValues){
    //     if(typeof newValues[val] === 'string'){
    //         newValues[val] = newValues[val].toLowerCase();
    //     } 
    // };
    
    try{
        const user = await db('users')
            .where({id: req.user.id})
            .first();

        if(user){
            const updated = await userDb.update(req.user.id, {...newValues});
            if(updated){
                const updatedUser = await userDb
                .findBy({id: req.user.id})
                .select('*');
                res.status(200).json({...updatedUser});
            }else{
                throw 'User could not be updated'
            }
        }
    }catch(err){
        console.log(err);
        switch(err){
            case 3: 
                res.status(422).json({message: `There is already an account associated with that email`});
                break;                
            case 4: 
                res.status(403).json({message: 'Invalid credentials.'});
                break;
            default:  res.status(500).json({message: 'Error updating user.'});
        }
    }
});

router.delete('/user', async (req, res) => {
    const {password} = req.body;
    // console.log('password', password);
    // console.log(req.body);
    // console.log(req.body.password);
    try{
        if(password){
            const user = await db('users')
            .where({id: req.user.id})
            .first();

            if(user && bcrypt.compareSync(password, user.password)){
                await userDb.remove(req.user.id);
                res.status(200).json({message: 'User successfully deleted'});
            }else{
                throw 1
            }
        }else{
            throw 2
        }
    }catch(err){
        if(err === 1){
            res.status(403).json({message: 'Invalid credentials.'});
        }else if(err === 2){
            res.status(400).json({message: 'Please provide password.'});
        }
        res.status(500).json({message: 'Error deleting user.'});
    }
});



// for debugging, remove when finished
router.get('/user/all', async (req, res) => {
    try{
        const user = await db('users as u')
            .select('u.*')
        if(user){
            res.status(200).json(user)
        }else{
            console.log('get user 404 error', user);
            res.status(404).json({message: `User with id ${req.user.id} not found.`});
        }
        
    }catch(err){
        console.log(err);
        res.status(500).json({message: 'Error getting user information.'});
    }
});

module.exports = router;