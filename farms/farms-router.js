const router = require('express').Router();
const bcrypt = require('bcryptjs');
const farmDb = require('./farms-model.js')
const userDb = require('../users/users-model.js');
const dbMethods = require('../data/db-model.js')

const db = require('../data/db-config.js');
const table = 'farms';

// new farm
router.post('/', async (req, res) => {
    const farm = { name, addressStreet, addressCity, addressState, zipCode } = req.body;
    console.log('Creating new farm:  ', farm);
    let missing = ''

    try{
        if(!name){
            missing= 'name';
            throw 1
        }if(!addressStreet){
            missing= 'addressStreet';
            throw 1
        }if(!addressCity){
            missing= 'addressCity';
            throw 1
        }if(!addressState){
            missing= 'addressState';
            throw 1
        }if(!zipCode){
            missing= 'zipCode';
            throw 1
        }if(zipCode.length !== 5){
            console.log(zipCode, zipCode.length)
            throw 2
        }if (isNaN(zipCode)){
            throw 3
        }
        
        const [id] = await dbMethods.add(table, farm);
        
        if(id){
            console.log(id);
            const ownerAdded = dbMethods.add('farmOwner', {farmID: id, ownerID: req.user.id});
            if (ownerAdded){
                const farm = await dbMethods.findById(table, id);
                if(farm){
                    res.status(200).json(farm);
                }
            }
            else{
                res.status(500).json({message: 'Error adding owner to new farm', error: err});
            }
        }
    }catch(err){
        if(err === 1){
            res.status(400).json({message: `Missing field: ${missing}`});
        }else if(err === 2){
            res.status(400).json({message: `Zip code must be five digits.`});
        }else if(err === 3){
            res.status(400).json({message: `Zip code must be a number.`});
        }else{
            console.log(err);
            res.status(500).json({message: 'Server could not add farm.', error: err});
        }
    }
});
// get all farms
router.get('/', async (req, res) => {
    try{
        const farms = await db('farms as f')
            .select('f.*')
        if(farms){
            res.status(200).json(farms)
        }else{
            console.log('Get all farms 404 error', farms);
            res.status(404).json({message: `Error loading farms`});
        }
        
    }catch(err){
        console.log('Get all farms 500 error', err);
        res.status(500).json({message: 'Error getting user information.'});
    }
});

// get farm by token
router.get('/farm', async (req, res) => {
    try{
        const fID = await db('users as u')
            .where({'u.id': req.user.id})
            .select('u.farmID')
            .first();
        if(fID){
            console.log('fID, fID.farmID: ', fID, fID.farmID)
            const farm = await dbMethods.findById(table, fID.farmID);
            if(farm){
                res.status(200).json(farm);
            }
            else{
                res.status(404).json({message: 'Farm with specified ID not found'});
            }
        }
        else{
            console.log('Get farm by token 404 error: userID/farmID', req.user.id, farmID);
            res.status(404).json({message: `Farm with id of ${farmID} of user with id ${req.user.id} not found.`});
        }
        
    }catch(err){
        console.log(err);
        res.status(500).json({message: 'Error getting farm by token.'});
    }
});

// get farm by param id
router.get('/:id', async (req, res) => {
    try{
        const farm = await dbMethods.findById(table, req.params.id);
        if(farm){
            res.status(200).json(farm);
        }else{
            throw 404;
        }
    }catch(err){
        console.log('Get farm by id error: ', err);
        switch(err){
            case 404: res.status(404).json({message: 'Farm with specified ID not found'});
                break;
            default: res.status(500).json({message: 'Error getting farm information'});
                break;
        }
    }
});

// get owner by farm ID
router.get('/:id/owner', async (req, res) => {
    try{
        const farm = await dbMethods.findById(table, req.params.id);
        if(farm){
            const owner = await db('farmOwner')
            .where({'farmOwner.farmID': req.params.id})
            .leftJoin('users as u', 'u.id', 'farmOwner.ownerID')
            .select('u.*')
            .first();
            if (owner){
                res.status(200).json(owner);
            }
            else {
                res.status(404).json({message: `Owner of ${farm.name} not found`});
            }
        }else{
            throw 404;
        }
    }catch(err){
        console.log('Get farm by id error: ', err);
        switch(err){
            case 404: res.status(404).json({message: 'Farm with specified ID not found'});
                break;
            default: res.status(500).json({message: 'Error getting farm information'});
                break;
        }
    }
});



router.put('/farm', async (req, res) => {
    const {username, email, cohort, name} = req.body;
    const newValues = {username, email, cohort, name};
    Object.keys(newValues).forEach(key => newValues[key] === undefined && delete newValues[key])
    
    for(let val in newValues){
        if(typeof newValues[val] === 'string'){
            newValues[val] = newValues[val].toLowerCase();
        } 
    };

    let {password} = req.body;
    const {newPassword} = req.body;
    
    try{
        if (!password){
            throw 4
        }
        if(username){
            if(!(/^[a-z][a-z0-9_]*$/i.test(username))){
                throw 1
            }
            const foundUsername = await db('users')
            .where({username: newValues.username})
            .first();

            if(foundUsername && foundUsername.username !== newValues.username){
                throw 2
            }
        }

        if(email){
            const foundEmail = await db('users')
            .where({email: newValues.email})
            .first();

            if(foundEmail && foundEmail.email !== newValues.email){
                throw 3
            }
        }

        const user = await db('users')
            .where({id: req.user.id})
            .first();

        if(user && bcrypt.compareSync(password, user.password)){
            console.log(password)
            if(newPassword){
                password = bcrypt.hashSync(newPassword, 8);
            }
            const updated = await userDb.update(req.user.id, newPassword ? {...newValues, password} : {...newValues});
            if(updated){
                const updatedUser = await userDb
                .findBy({id: req.user.id})
                .select('id', 'username', 'email', 'name', 'cohort');
                
                res.status(200).json({...updatedUser});
            }else{
                throw 'User could not be updated'
            }
        }else{
            throw 4
        }
    }catch(err){
        console.log(err);
        switch(err){
            case 1:
                res.status(400).json({message: 'Username must only contain characters A-Z, _, and 0-9. Username must start with a letter.'});
                break;
            case 2: 
                res.status(409).json({message: `Username '${username}' is already in use.`});
                break;
            case 3: 
                res.status(409).json({message: `There is already an account associated with that email`});
                break;                
            case 4: 
                res.status(409).json({message: 'Invalid credentials.'});
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




module.exports = router;