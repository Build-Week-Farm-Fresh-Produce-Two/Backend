
exports.up = function(knex) {
    return knex.schema.createTable('orderedProducts', tbl => {
        tbl.integer('orderID', 255)
            .unsigned()
            .notNullable()
            .references('id')
            .inTable('orders')
        tbl.integer('supplyID', 255)
            .unsigned()
            .notNullable()
            .references('id')
            .inTable('users')
        tbl.integer('quantity', 255)
            .unsigned()
            .notNullable()
        tbl.primary(['orderID', 'supplyID'])
    })
};

exports.down = function(knex) {
    return knex.schema.dropTableIfExists('orderedProducts');
};

//orderedProducts
// orderID required
// productID required