const router = require('express').Router();
const bcrypt = require('bcryptjs');
const dbMethods = require('../data/db-model.js')
const db = require('../data/db-config.js');

const table = 'products';

// products table- add category to table? growing/available season? help filter

// new product
router.post('/', async (req, res) => {
    const product = { name, description, imageURL } = req.body;
    console.log('Creating new product:  ', product);
    let missing = ''

    try{
        if(!name){
            missing= 'name';
            throw 1
        }if(!description){
            missing= 'description';
            throw 1
        }
        
        const [productID] = await dbMethods.add(table, req.body);
        
        if(productID){
            console.log('New product id:', productID);
            const newProduct = await dbMethods.findById(table, productID);
            if(newProduct){
                res.status(200).json(newProduct);
            }else{
                console.log(err);
                res.status(500).json({message: 'Error adding product.', error: err});
            }
        }
    }catch(err){
        if(err === 1){
            res.status(400).json({message: `Missing field: ${missing}`});
        }else{
            console.log(err);
            res.status(500).json({message: 'Server could not add product.', error: err});
        }
    }
});
// get all products
router.get('/', async (req, res) => {
    try{
        const products = await db('products as p')
            .select('p.*')
        if(products){
            res.status(200).json(products)
        }else{
            console.log('Get all products 404 error', products);
            res.status(404).json({message: `Error loading products`});
        }
        
    }catch(err){
        console.log('Get all products 500 error', err);
        res.status(500).json({message: 'Error getting products information.'});
    }
});

// would be good to convert these to queries later after build week
// get product by param id
router.get('/id/:id', async (req, res) => {
    try{
        if(isNaN(req.params.id)){
            throw 1
        }
        const product = await dbMethods.findById(table, req.params.id);
        if(product){
            res.status(200).json(product);
        }else{
            throw 404;
        }
    }catch(err){
        console.log('Get product by id error: ', err);
        switch(err){
            case 1: res.status(400).json({message: 'ID must be a number'});
                break;
            case 404: res.status(404).json({message: 'Product with specified ID not found'});
                break;
            default: res.status(500).json({message: 'Error getting product information'});
                break;
        }
    }
});

// search products by name
router.get('/name/:name', async (req, res) => {
    try{
        console.log('Get products by name: ', req.params.name);
        const products = await dbMethods.searchBy(table, 'name', req.params.name);
        if(products){
            res.status(200).json(products);
        }else{
            throw 404;
        }
    }catch(err){
        console.log('Get products by name error: ', err);
        switch(err){
            case 404: res.status(404).json({message: `Products including "${req.params.name}" not found`});
                break;
            default: res.status(500).json({message: 'Error getting products by name'});
                break;
        }
    }
});

// search products by description
router.get('/desc/:desc', async (req, res) => {
    try{
        console.log('Get products by desc: ', req.params.desc);
        const products = await dbMethods.searchBy(table, 'description', req.params.desc);
        if(products){
            res.status(200).json(products);
        }else{
            throw 404;
        }
    }catch(err){
        console.log('Get products by description error: ', err);
        switch(err){
            case 404: res.status(404).json({message: `Products including "${req.params.desc}" not found`});
                break;
            default: res.status(500).json({message: 'Error getting products by description'});
                break;
        }
    }
});



// get products by farm? or just do supply, yeah to supply and just show 0 supply if out, they can delete supplies




module.exports = router;