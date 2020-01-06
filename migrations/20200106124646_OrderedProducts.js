
exports.up = function(knex) {
    return knex.schema.createTable('orderedProducts', tbl => {
        tbl.primary(['orderID', 'productID'])
        tbl.integer('orderID', 255)
            .notNullable(),
        tbl.integer('productID', 255)
            .notNullable()
    })
};

exports.down = function(knex) {
    return knex.schema.dropTableIfExists('orderedProducts');
};

//orderedProducts
// orderID required
// productID required