
exports.up = function(knex) {
    return knex.schema.createTable('users', tbl => {
        tbl.increments();
        tbl.integer('farmID', 255)
        tbl.isFarmer('extremeCold', 255)
            .notNullable();
        tbl.string('email', 255)
            .notNullable()
            .unique(); 
        tbl.string('username', 255)
            .notNullable()
            .unique(); 
        tbl.string('password', 255)
            .notNullable();
        tbl.string('name', 255)
            .notNullable();
        tbl.integer('zipCode', 255)
            .notNullable();
        tbl.string('addressStreet', 255)
            .notNullable();
        tbl.string('addressCity', 255)
            .notNullable();
        tbl.string('addressState', 255)
            .notNullable();
    })
};

exports.down = function(knex) {
    return knex.schema.dropTableIfExists('users');
};

//users
// id
// int farmID optional, required if isFarmer true
// bool isFarmer required
// string email required unique
// string username required unique
// string password required
// string name required
// 5 digit zip code required
// address street optional
// address city optional
// address state optional

//farms
// id
// ownerUserID required
// name required
// address street required
// address city required
// address state required
// 5 digit zip code required

//products
// id
// name required
// description required
// imageURL optional

//supply
// farmID required
// productID required
// string measurement type (pounds, ounces, etc) required
// int quantity required
// int price required

//orders
// id
// int farmID required
// int customerID required
// int total price required
// bool paymentStatus required
// bool fulfillmentStatus required 

//orderedProducts
// orderID required
// productID required
