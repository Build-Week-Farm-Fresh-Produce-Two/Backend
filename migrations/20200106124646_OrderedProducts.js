
exports.up = function(knex) {
    return knex.schema.createTable('orderedProducts', tbl => {
        tbl.increments();
        tbl.integer('orderID', 255)
            .unsigned()
            .notNullable()
            .references('id')
            .inTable('orders')
            .onDelete('CASCADE')
        tbl.integer('supplyID', 255)
            .unsigned()
            .references('id')
            .inTable('supply')
            .onDelete('SET NULL')
        tbl.integer('quantity', 255)
            .unsigned()
            .notNullable()
    })
};

exports.down = function(knex) {
    return knex.schema.dropTableIfExists('orderedProducts');
};

//orderedProducts
// orderID required
// productID required