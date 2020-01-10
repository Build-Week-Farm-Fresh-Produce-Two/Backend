
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
        tbl.string('productName', 255)
            .notNullable();
        tbl.string('productDescription', 255)
            .notNullable();
        tbl.string('productImageURL', 255)
        tbl.string('purchasedMeasurementType', 255)
            .notNullable();
        tbl.integer('purchasedQuantity', 255)
            .unsigned()
            .notNullable()
        tbl.decimal('purchasedPrice', [null])
            .unsigned()
            .notNullable();
    })
};

exports.down = function(knex) {
    return knex.schema.dropTableIfExists('orderedProducts');
};

//orderedProducts
// orderID required
// productID required