
exports.up = function(knex) {
    return knex.schema.createTable('orders', tbl => {
        tbl.increments();
        tbl.integer('farmID', 255)
            .unsigned()
            .references('id')
            .inTable('farms')
            .onDelete('SET NULL')
        tbl.integer('customerID', 255)
            .unsigned()
            .references('id')
            .inTable('users')
            .onDelete('SET NULL')
        tbl.string('customerName', 255)
            .notNullable();
        tbl.string('farmName', 255)
            .notNullable();
        tbl.decimal('totalPrice', [null])
            .unsigned()
            .notNullable(),
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