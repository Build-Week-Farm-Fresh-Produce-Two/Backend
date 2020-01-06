
exports.up = function(knex) {
    return knex.schema.createTable('orders', tbl => {
        tbl.increments();
        tbl.integer('farmID', 255)
            .notNullable(),
        tbl.integer('customerID', 255)
            .notNullable(),
        tbl.integer('totalPrice', 255)
            .notNullable(),
        tbl.string('measurementType', 255)
            .notNullable();
        tbl.boolean('paymentStatus', 255)
            .notNullable();
        tbl.boolean('fulfillmentStatus', 255)
            .notNullable();
    })
};

exports.down = function(knex) {
    return knex.schema.dropTableIfExists('orders');
};

//orders
// id
// int farmID required
// int customerID required
// int totalPrice required
// bool paymentStatus required
// bool fulfillmentStatus required 