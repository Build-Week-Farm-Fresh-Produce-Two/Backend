const router = require('express').Router();
const bcrypt = require('bcryptjs');
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
        
        const [farmID] = await dbMethods.add(table, farm);
        
        if(farmID){
            console.log('new farm id:', farmID);
            const ownerAdded = await dbMethods.add('farmOwner', {farmID: farmID, ownerID: req.user.id});
            if (ownerAdded){
                console.log('ownerAdded: ', ownerAdded);
                const farm = await dbMethods.findById(table, farmID);
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

// get all owners
router.get('/owners', async (req, res) => {
    try{
        const owner = await db('farmOwner')
        .select('farmOwner.*')
        if (owner){
            res.status(200).json(owner);
        }
        else {
            res.status(404).json({message: `Owners not found`});
        }
    }catch(err){
        console.log('Get all owners error: ', err);
        switch(err){
            default: res.status(500).json({message: 'Error getting farm owner information'});
                break;
        }
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

// update farm by id, can also update owner
router.put('/:id', async (req, res) => {
    const { name, addressStreet, addressCity, addressState, zipCode, password, newOwnerID } = req.body;
    const newValues = {name, addressStreet, addressCity, addressState, zipCode};
    
    try{
        const farm = await dbMethods.findById(table, req.params.id);
        if (newOwnerID){
            if(isNaN(newOwnerID)){
                throw 4
            }
            const newOwner = await dbMethods.findById('users', newOwnerID);
            if (!newOwner){
                throw 5
            }
        }
        if (zipCode){
            if(zipCode.length !== 5){
                console.log(zipCode, zipCode.length)
                throw 6
            }if (isNaN(zipCode)){
                throw 7
            }
        }
        if (farm){
            console.log(`Updating farm id: ${farm.id} name: ${farm.name}: new values: `, newValues);
            if(password){
                const user = await db('users')
                .where({id: req.user.id})
                .first();
                if(user && bcrypt.compareSync(password, user.password)){
                    const ownerRow = await db('farmOwner')
                    .where({farmID: req.params.id})
                    .select('farmOwner.*')
                    .first();
                    if (ownerRow && ownerRow.ownerID === req.user.id){
                        if (newOwnerID){
                            await dbMethods.update('farmOwner', ownerRow.id, {ownerID: newOwnerID})
                        }
                            await dbMethods.update(table, ownerRow.farmID, newValues);
                            const newFarm = await dbMethods.findById(table, req.params.id);
                        res.status(200).json({message: `Farm ${farm.name} successfully updated`, farm: newFarm});
                    }else{
                        console.log('ownerID, req.user.id: ', ownerRow.ownerID, req.user.id);
                        throw 3
                    }
                }else{
                    throw 1
                }
            }else{
                throw 2
            }
        }else{
            throw 404
        }
    }catch(err){
        if(err === 1){
            res.status(403).json({message: 'Invalid credentials.'});
        }else if(err === 2){
            res.status(400).json({message: 'Please provide password.'});
        }else if(err === 3){
            res.status(403).json({message: 'Only the owner of a farm may update it.'});
        }else if(err === 4){
            res.status(400).json({message: 'New owner ID must be a number.'});
        }else if(err === 5){
            res.status(404).json({message: `No user found for newOwnerID: ${newOwnerID}`});
        }else if(err === 6){
            res.status(400).json({message: `Zip code must be five digits.`});
        }else if(err === 3){
            res.status(407).json({message: `Zip code must be a number.`});
        }else if(err === 404){
            res.status(404).json({message: `Farm with ID ${req.params.id} not found.`});
        }
        console.log('Update farm by id 500 catch error: ', err);
        res.status(500).json({message: 'Error updating farm.', error: err});
    }
});

// delete owner by id
router.delete('/:id', async (req, res) => {
    const {password} = req.body;
    console.log('Attempting to delete farm with id: ', req.params.id)
    // console.log('password', password);
    // console.log(req.body);
    // console.log(req.body.password);
    try{
        const farm = await dbMethods.findById(table, req.params.id);
        if (farm){
            if(password){
                const user = await db('users')
                .where({id: req.user.id})
                .first();
                if(user && bcrypt.compareSync(password, user.password)){
                    const ownerRow = await db('farmOwner')
                    .where({farmID: req.params.id})
                    .select('farmOwner.*')
                    .first();
                    if (ownerRow && ownerRow.ownerID === req.user.id){
                        console.log('ownerRow.ownerID, req.user.id: ', ownerRow.ownerID, req.user.id);
                        await dbMethods.remove('farmOwner', {farmID: ownerRow.farmID})
                        await dbMethods.remove(table, {id: ownerRow.farmID});
                        res.status(200).json({message: `Farm ${farm.name} successfully deleted`});
                    }else{
                        console.log('ownerID, req.user.id: ', ownerRow.ownerID, req.user.id);
                        throw 3
                    }
                }else{
                    throw 1
                }
            }else{
                throw 2
            }
        }else{
            throw 404
        }
    }catch(err){
        if(err === 1){
            res.status(403).json({message: 'Invalid credentials.'});
        }else if(err === 2){
            res.status(400).json({message: 'Please provide password.'});
        }else if(err === 3){
            res.status(403).json({message: 'Only the owner of a farm may delete it.'});
        }else if(err === 404){
            res.status(404).json({message: `Farm with ID ${req.params.id} not found.`});
        }
        console.log('Delete farm by id 500 catch error: ', err);
        res.status(500).json({message: 'Error deleting farm.', error: err});
    }
});




module.exports = router;