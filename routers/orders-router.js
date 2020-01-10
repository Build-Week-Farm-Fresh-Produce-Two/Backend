const router = require('express').Router();
const bcrypt = require('bcryptjs');
const dbMethods = require('../data/db-model.js')
const db = require('../data/db-config.js');

const table = 'orders';

function getOrder(orderID){
    return db('orders as o')
    .where({'o.id': orderID})
    .select('o.*')
}
function getOrderedProducts(orderID){
    return db('orderedProducts as op')
    .where({'op.orderID': orderID})
    .select('op.*')
}
const functionWithPromise = order => { 
    //a function that returns a promise
    return Promise.resolve(db('orderedProducts as op')
    .where({'op.orderID': order.id})
    .select('op.*')
    .then((res)=>{
        // console.log('getAllOrderedProducts map success: ', res);
        // console.log('old object: ', order)
        // console.log('new obj test:', {...order, orderedProducts: [...res]})
        return {...order, orderedProducts: [...res]}
    }))
} 
const anAsyncFunction = async order => {
return functionWithPromise(order)
}
const getAllOrderedProducts = async (orderArray) => {
return Promise.all(orderArray.map(order => anAsyncFunction(order)))
}

// new farm
router.post('/', async (req, res) => {
    const { farmID, customerID, farmName, customerName, totalPrice, paymentStatus, fulfillmentStatus, orderedProducts } = req.body;
    const order = {farmID, customerID, farmName, customerName, totalPrice, paymentStatus, fulfillmentStatus }
    let quantityArray = [];
    console.log('Creating new order:  ', order);
    let badValue = '';
    let errorMessage = '';

    try{
    // #region error checkers
        // #region order vars 
        if(!farmID){
            badValue= 'farmID';
            throw 1
        }if(!customerID){
            badValue= 'customerID';
            throw 1
        }if(!farmName){
            badValue= 'farmName';
            throw 1
        }if(!customerName){
            badValue= 'customerName';
            throw 1
        }if(!totalPrice){
            badValue= 'totalPrice';
            throw 1
        }if(!paymentStatus){
            badValue= 'paymentStatus';
            throw 1
        }if(!fulfillmentStatus){
            badValue= 'fulfillmentStatus';
            throw 1
        }if (Math.sign(farmID) !== 1){
            badValue= 'farmID';
            throw 2
        }if (Math.sign(customerID) !== 1){
            badValue= 'customerID';
            throw 2
        }if (Math.sign(totalPrice) !== 1){
            badValue= 'totalPrice';
            throw 2
        }
        // #endregion
        // #region orderedProducts
        if(!orderedProducts.length > 0){
            badValue= 'orderedProducts';
            throw 1
        }
        else {
            const supplyCheck = await db('supply')
            .where({farmID: farmID})
            .select('supply.*');
            if(supplyCheck){
                for (let i = 0; i < orderedProducts.length; i++){
                    // #region basic vars check
                    if (!orderedProducts[i].supplyID){
                        badValue= `orderedProducts[${i}].supplyID`;
                        throw 1
                    }if (!orderedProducts[i].productName){
                        badValue= `orderedProducts[${i}].productName`;
                        throw 1
                    }if (!orderedProducts[i].productDescription){
                        badValue= `orderedProducts[${i}].productDescription`;
                        throw 1
                    }if (!orderedProducts[i].purchasedMeasurementType){
                        badValue= `orderedProducts[${i}].purchasedMeasurementType`;
                        throw 1
                    }if (!orderedProducts[i].purchasedQuantity){
                        badValue= `orderedProducts[${i}].purchasedQuantity`;
                        throw 1
                    }if (!orderedProducts[i].purchasedPrice){
                        badValue= `orderedProducts[${i}].purchasedPrice`;
                        throw 1
                    }
                    if (Math.sign(orderedProducts[i].supplyID) !== 1){
                        badValue= `orderedProducts[${i}].supplyID`;
                        throw 2
                    }if (Math.sign(orderedProducts[i].purchasedQuantity) !== 1){
                        badValue= `orderedProducts[${i}].purchasedQuantity`;
                        throw 2
                    }if (Math.sign(orderedProducts[i].purchasedQuantity) !== 1){
                        badValue= `orderedProducts[${i}].purchasedQuantity`;
                        throw 2
                    }if (Math.sign(orderedProducts[i].purchasedPrice) !== 1){
                        badValue= `orderedProducts[${i}].purchasedPrice`;
                        throw 2
                    }
                    //#endregion
    
                    // check farm's supply against orderedProduct
                    for (let s = 0; s < supplyCheck.length; s++){
                        if (supplyCheck[s].id === orderedProducts[i].supplyID){
                            if (supplyCheck[s].quantity < orderedProducts[i].purchasedQuantity){
                                errorMessage = `You cannot purchase more products than are in stock. Bad value: orderedProducts[${i}] - ${orderedProducts[i].productName}`;   
                                throw 3
                            }
                            if (supplyCheck[s].price !== orderedProducts[i].purchasedPrice){
                                errorMessage = `Supply product price (${supplyCheck[s].price}) should equal orderedProduct purchase price (${orderedProducts[i].purchasedPrice})`;
                                throw 3
                            }
                            if (supplyCheck[s].measurementType !== orderedProducts[i].purchasedMeasurementType){
                                errorMessage = `Supply product measurement (${supplyCheck[s].measurementType}) should equal orderedProduct measurement (${orderedProducts[i].purchasedMeasurementType})`;
                                throw 3
                            }
                            quantityArray[i] = supplyCheck[s].quantity - orderedProducts[i].purchasedQuantity;
                            break;
                        }
                        if (s === supplyCheck.length-1){
                            res.status(404).json({message: `orderedProducts[${i}].supplyID (${orderedProducts[i].supplyID}) not found in farm`});
                        }
                    }
                }
            }
            else {
                res.status(404).json({message: 'Farm with specified ID not found'});
            }
        // #endregion
        }
    // #endregion
        


        const postman = await db.transaction(async trx => {
            try{
                const orderAdded = await trx(table)
                .insert({...order}, 'id');

                console.log('orderAdded: ', orderAdded)
                const productsAdded = ''
                const supplyUpdated = ''
                if (orderAdded){
                    console.log('orderAdded inside: ', orderAdded[0])
                    for (let q = 0; q < orderedProducts.length; q++){
                        let opAdded = await trx('orderedProducts')
                        .insert({...orderedProducts[q], orderID: orderAdded[0]});
                        let suppUpdated = await trx('supply')
                        .where({id: orderedProducts[q].supplyID})
                        .update({quantity: quantityArray[q]});
                        if (opAdded && suppUpdated && q === orderedProducts.length-1){
                            productsAdded = true;
                        }
                    } 
                }
                if(orderAdded && productsAdded && supplyUpdated){
                    return true;
                }
            }catch(err){
                throw err;
            }
        });
        if (postman){
            res.status(200).json({message: `Successfully posted a new order.`});
        }

    }catch(err){
        if(err === 1){
            res.status(400).json({message: `Missing field: ${badValue}`});
        }else if(err === 2){
            res.status(400).json({message: `${badValue} must be a number and must be positive`});
        }else if(err === 3){
            res.status(403).json({message: errorMessage});
        }else{
            console.log(err);
            res.status(500).json({message: 'Server could not add farm.', error: err});
        }
    }
});

// get all orders
router.get('/', async (req, res) => {
    try{
        const orders = await db('orders as o')
            .select('o.*')
        if(orders.length > 0){
            const ordersWithProducts = await getAllOrderedProducts(orders);
            if (ordersWithProducts.length > 0){
                // console.log('ordersWithProducts success: ', ordersWithProducts);
                res.status(200).json(ordersWithProducts);
            }
            else{
                // console.log('ordersWithProducts error: ', ordersWithProducts);
                res.status(404).json({message: `Error loading ordersWithProducts`});
            }
            // res.status(200).json(orders)
        }else{
            console.log('Get all orders 404 error', orders);
            res.status(404).json({message: 'No orders found'});
        }
    }catch(err){
        console.log('Get all orders 500 error', err);
        res.status(500).json({message: 'Error getting orders information.'});
    }
});
// get orders by farm by token
router.get('/farm', async (req, res) => {
    try{
        const farm = await dbMethods.findById('farms', req.user.farmID);
        if(farm){
            const orders = await db('orders as o')
                .where({farmID: farm.id})
                .select('o.*')
                if(orders.length > 0){
                    const ordersWithProducts = await getAllOrderedProducts(orders);
                    if (ordersWithProducts.length > 0){
                        // console.log('ordersWithProducts success: ', ordersWithProducts);
                        res.status(200).json(ordersWithProducts);
                    }
                    else{
                        // console.log('ordersWithProducts error: ', ordersWithProducts);
                        res.status(404).json({message: `Error loading ordersWithProducts`});
                    }
                    // res.status(200).json(orders)
                }else{
                    console.log('Get orders by farm 404 error', orders);
                    res.status(404).json({message: 'No orders found'});
                }
        }
        else{
            res.status(404).json({message: 'Farm with specified ID not found'});
        }
    }catch(err){
        console.log(err);
        res.status(500).json({message: 'Error getting orders by farmID by token.'});
    }
});
// Get orders by user by token
router.get('/user', async (req, res) => {
    try{
        const orders = await db('orders as o')
        .where({customerID: req.user.id})
        .select('o.*')
        if(orders.length > 0){
            const ordersWithProducts = await getAllOrderedProducts(orders);
            if (ordersWithProducts.length > 0){
                // console.log('ordersWithProducts success: ', ordersWithProducts);
                res.status(200).json(ordersWithProducts);
            }
            else{
                // console.log('ordersWithProducts error: ', ordersWithProducts);
                res.status(404).json({message: `Error loading ordersWithProducts`});
            }
            // res.status(200).json(orders)
        }else{
            console.log('Get orders by farm 404 error', orders);
            res.status(404).json({message: 'No orders found'});
        }
    }catch(err){
        console.log(err);
        res.status(500).json({message: 'Error getting orders by userID by token.'});
    }
});
// get order by param id
router.get('/:id', async (req, res) => {
    try{
        const order = await db('orders as o')
            .where({id: req.params.id})
            .select('o.*')
        if(order.length > 0){
            if (req.user.id === order[0].customerID || req.user.farmID === order[0].farmID)
            {
                const ordersWithProducts = await getAllOrderedProducts(order);
                if (ordersWithProducts.length > 0){
                    // console.log('ordersWithProducts success: ', ordersWithProducts);
                    res.status(200).json(ordersWithProducts);
                }
                else{
                    // console.log('ordersWithProducts error: ', ordersWithProducts);
                    res.status(404).json({message: `Error loading ordersWithProducts`});
                }
            }
            else{
                throw 403
            }
        }else{
            throw 404;
        }
    }catch(err){
        console.log('Get farm by id error: ', err);
        switch(err){
            case 403: res.status(403).json({message: 'You are not authorized to pull this order data'});
                break;
            case 404: res.status(404).json({message: 'Order with specified ID not found'});
                break;
            default: res.status(500).json({message: 'Error getting farm information'});
                break;
        }
    }
});
// get orders by param user and farm
router.get('/:user/:farm', async (req, res) => {
    try{
        if (Math.sign(req.params.user) !== 1 || Math.sign(req.params.farm) !== 1 ){
            res.status(400).json({message: 'User and Farm params must be a number and must be positive'});
        }
        if (req.user.id != req.params.user && req.user.farmID != req.params.farm){
            console.log(`req.user.id: ${req.user.id}, req.params.user: ${req.params.user}, req.user.farmID: ${req.user.farmID}, req.params.farm: ${req.params.farm}`);
            throw 1;
        }

        const farmCheck = await dbMethods.findById('farms', req.params.farm);
        if(!farmCheck){
            res.status(404).json({message: 'Farm with specified ID not found'});
        }
        const userCheck = await dbMethods.findById('users', req.params.user);
        if(!userCheck){
            res.status(404).json({message: 'User with specified ID not found'});
        }

        const orders = await db('orders as o')
        .where({farmID: req.params.farm, customerID: req.params.user})
        .select('o.*')
        if(orders.length > 0){
            const ordersWithProducts = await getAllOrderedProducts(orders);
            if (ordersWithProducts.length > 0){
                // console.log('ordersWithProducts success: ', ordersWithProducts);
                res.status(200).json(ordersWithProducts);
            }
            else{
                // console.log('ordersWithProducts error: ', ordersWithProducts);
                res.status(404).json({message: `Error loading ordersWithProducts`});
            }
            // res.status(200).json(orders)
        }else{
            console.log('Get orders by farm 404 error');
            res.status(404).json({message: 'No orders found'});
        }
    }catch(err){
        if (err === 1){
            res.status(403).json({message: 'You are not authorized to pull this order data'});
        }
        console.log(err);
        res.status(500).json({message: 'Error getting orders by farmID by token.'});
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