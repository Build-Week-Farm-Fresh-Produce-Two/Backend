const router = require('express').Router();
const bcrypt = require('bcryptjs');
const dbMethods = require('../data/db-model.js')
const db = require('../data/db-config.js');

const table = 'supply';

// new supply
router.post('/', async (req, res) => {
    const { farmID, productID, measurementType, quantity, price } = req.body;
    console.log('Creating new supply:  ', req.body);
    let badValue = ''
    try{
        // #region error throws
        if(!farmID){
            badValue= 'farmID';
            throw 1
        }if(!productID){
            badValue= 'productID';
            throw 1
        }if(!measurementType){
            badValue= 'measurementType';
            throw 1
        }if(!quantity){
            badValue= 'quantity';
            throw 1
        }if(!price){
            badValue= 'price';
            throw 1
        }if (isNaN(farmID)){
            badValue= 'farmID';
            throw 2
        }if (isNaN(productID)){
            badValue= 'productID';
            throw 2
        }if (isNaN(quantity)){
            badValue= 'quantity';
            throw 2
        }if (isNaN(price)){
            badValue= 'price';
            throw 2
        }if (!isNaN(measurementType)){
            badValue= 'measurementType';
            throw 3
        }
        const farmCheck = await dbMethods.findById('farms', farmID);
        if (!farmCheck){
            throw 4
        }
        else if (farmCheck)
        {
            console.log('farmCheck', farmCheck);
            console.log('user farmID', req.user.farmID);
            if (farmCheck.id !== req.user.farmID){
                throw 7
            }
        }
        const productCheck = await dbMethods.findById('products', productID);
        if (!productCheck){
            throw 5
        }
        const supplyCheck = await dbMethods.findByMultiple(table, {farmID: farmID}, {productID: productID});
        if (supplyCheck.length > 0){
            console.log('supplyCheck', supplyCheck);
            throw 6
        }
        // #endregion
        console.log('supply post req.body: ', req.body);
        const [newSupply] = await dbMethods.add(table, req.body);
        
        if(newSupply){
            console.log('New Supply id: ', newSupply);
            const supplies = await db('supply as s')
            .where({'s.id': newSupply})
            .leftJoin('farms as f', 'f.id', 's.farmID')
            .leftJoin('products as p', 'p.id', 's.productID')
            .select('f.name as farmName', 'p.* as product', 's.*')
            .first();
            if(supplies){
                res.status(200).json(supplies)
            }
        }
    }catch(err){
        if(err === 1){
            res.status(400).json({message: `Missing field: ${badValue}`});
        }else if(err === 2){
            res.status(400).json({message: `${badValue} must be a number`});
        }else if(err === 3){
            res.status(400).json({message: `${badValue} must be a string`});
        }else if(err === 4){
            res.status(404).json({message: `Farm with ID ${farmID} not found`});
        }else if(err === 5){
            res.status(404).json({message: `Product with ID ${productID} not found`});
        }else if(err === 6){
            res.status(409).json({message: `Farm id ${farmID} already has a supply for Product with ID ${productID}`});
        }else if(err === 7){
            res.status(409).json({message: `User must belong to farm to modify it's supply`});
        }else{
            console.log(err);
            res.status(500).json({message: 'Server could not add supply.', error: err});
        }
    }
});
// get all supplies
router.get('/', async (req, res) => {
    try{
        const supplies = await db('supply as s')
        .leftJoin('products as p', 'p.id', 's.productID')
        .select('p.* as product', 's.*')
        if(supplies){
            res.status(200).json(supplies)
        }else{
            console.log('Get all supplies 404 error', supplies);
            res.status(404).json({message: `Error loading supplies`});
        }
    }catch(err){
        console.log('Get all supplies 500 error', err);
        res.status(500).json({message: 'Error getting all supplies.'});
    }
});
// get supplies by farm by token
router.get('/farm', async (req, res) => {
    try{
        const fID = await db('users as u')
            .where({'u.id': req.user.id})
            .select('u.farmID')
            .first();
        if(fID){
            console.log('fID, fID.farmID: ', fID, fID.farmID)
            const farm = await dbMethods.findById('farms', fID.farmID);
            if(farm){
                console.log('get supplies by token farm: ', farm);
                const supplies = await db('supply as s')
                .where({farmID: farm.id})
                .leftJoin('products as p', 'p.id', 's.productID')
                .select('p.* as product', 's.*')
                if(supplies){
                    res.status(200).json({farm: farm.name, farmID: farm.id, supplies})
                }else{
                    console.log('Get supplies by farm by token 404 error', supplies);
                    res.status(404).json({message: `Error loading supplies`});
                }

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
// get supplies by farm by ID
router.get('/farm/:id', async (req, res) => {
    try{
        if (isNaN(req.params.id)){
            throw 1
        }
        console.log('get supplies by farm by id: ', req.params.id);
        const farm = await dbMethods.findBy('farms', {id: req.params.id});
        if(farm){
            const supplies = await db('supply as s')
            .where({farmID: farm.id})
            .leftJoin('products as p', 'p.id', 's.productID')
            .select('p.* as product', 's.*')
            if(supplies){
                res.status(200).json({farm: farm.name, farmID: farm.id, supplies})
            }else{
                console.log('Get supplies by farm by id 404 error', supplies);
                res.status(404).json({message: `Error loading supplies`});
            }
        }
        else{
            res.status(404).json({message: 'Farm with specified ID not found'});
        }
    }catch(err){
        console.log(err);
        if(err === 1){
            res.status(400).json({message: 'ID must be a number.'});
        }
        res.status(500).json({message: `Error getting farm by id: ${req.params.id}`, err});
    }
});
// get farms and supply by product ID
router.get('/product/:id', async (req, res) => {
    try{
        if (isNaN(req.params.id)){
            throw 1
        }
        const product = await dbMethods.findById('products', req.params.id);
        if(product){
            console.log('product: ', product)
            console.log('get supplies by productID: ', req.params.id)
            const supplies = await db('supply as s')
            .where({productID: req.params.id})
            .leftJoin('farms as f', 'f.id', 's.farmID')
            .leftJoin('products as p', 'p.id', 's.productID')
            .select('f.name as farmName', 'p.* as product', 's.*', );
            if(supplies.length > 0){
                res.status(200).json(supplies)
            }
            else{
                res.status(404).json({message: 'Supplies with specified product ID not found'});
            }
        }else{
            console.log('product: ', product)
            throw 2
    }
    }catch(err){
        console.log(err);
        if(err === 1){
            res.status(400).json({message: 'ID must be a number.'});
        }
        if(err === 2){
            res.status(404).json({message: `Product with id: ${req.params.id} not found`});
        }
        res.status(500).json({message: 'Error getting supplies by product ID.'});
    }
});
// update supply by id
router.put('/:id', async (req, res) => {const { farmID, productID, measurementType, quantity, price } = req.body;
    console.log('Creating new supply:  ', req.body);
    let badValue = ''
    try{
        // #region error throws
        if(!farmID){
            badValue= 'farmID';
            throw 1
        }if(!productID){
            badValue= 'productID';
            throw 1
        }if(!measurementType){
            badValue= 'measurementType';
            throw 1
        }if(!quantity){
            badValue= 'quantity';
            throw 1
        }if(!price){
            badValue= 'price';
            throw 1
        }if (Math.sign(farmID) !== 1){
            badValue= 'farmID';
            throw 2
        }if (Math.sign(productID) !== 1){
            badValue= 'productID';
            throw 2
        }if (Math.sign(quantity) !== 1){
            badValue= 'quantity';
            throw 2
        }if (Math.sign(price) !== 1){
            badValue= 'price';
            throw 2
        }if (!isNaN(measurementType)){
            badValue= 'measurementType';
            throw 3
        }
        const farmCheck = await dbMethods.findById('farms', farmID);
        if (!farmCheck){
            throw 4
        }
        else if (farmCheck)
        {
            console.log('farmCheck', farmCheck);
            console.log('user farmID', req.user.farmID);
            if (farmCheck.id !== req.user.farmID){
                throw 6
            }
        }
        const supplyCheck = await dbMethods.findById(table, req.params.id);
        if (!supplyCheck){
            throw 5
        }
        // if ()
        // #endregion
        const newSupply = await dbMethods.update(table, req.params.id, {measurementType, quantity, price});
        
        if(newSupply){
            console.log('New Supply id: ', newSupply);
            const supplies = await db('supply as s')
            .where({'s.id': newSupply})
            .leftJoin('farms as f', 'f.id', 's.farmID')
            .leftJoin('products as p', 'p.id', 's.productID')
            .select('f.name as farmName', 'p.* as product', 's.*')
            .first();
            if(supplies){
                res.status(200).json(supplies)
            }
        }
    }catch(err){
        if(err === 1){
            res.status(400).json({message: `Missing field: ${badValue}`});
        }else if(err === 2){
            res.status(400).json({message: `${badValue} must be a number and must be positive`});
        }else if(err === 3){
            res.status(400).json({message: `${badValue} must be a string`});
        }else if(err === 4){
            res.status(404).json({message: `Farm with ID ${farmID} not found`});
        }else if(err === 5){
            res.status(409).json({message: `Supply with ID ${req.params.id} not found`});
        }else if(err === 6){
            res.status(403).json({message: `Only an employee of a farm may modify it's supply`});
        }else{
            console.log(err);
            res.status(500).json({message: 'Server could not add supply.', error: err});
        }
    }
});
// delete supply by id
router.delete('/:id', async (req, res) => {
    const {password} = req.body;
    console.log('Attempting to delete supply with id: ', req.params.id)

    try{
        const supply = await dbMethods.findById(table, req.params.id);
        if (supply){
            console.log('supply: ', supply);
            if (supply.farmID !== req.user.farmID){
                throw 3
            }
            if(password){
                const user = await db('users')
                .where({id: req.user.id})
                .first();
                if(user && bcrypt.compareSync(password, user.password)){
                    await dbMethods.remove(table, {id: req.params.id});
                    res.status(200).json({message: `Supply with id: ${supply.id} successfully deleted`});
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
            res.status(403).json({message: `Only an employee of a farm may modify it's supply`});
        }else if(err === 404){
            res.status(404).json({message: `Supply with ID ${req.params.id} not found.`});
        }
        console.log('Delete supply by id 500 catch error: ', err);
        res.status(500).json({message: 'Error deleting supply.', error: err});
    }
});

module.exports = router;