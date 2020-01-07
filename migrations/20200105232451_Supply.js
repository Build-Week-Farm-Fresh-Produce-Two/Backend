
exports.up = function(knex) {
    return knex.schema.createTable('supply', tbl => {
        tbl.increments();
        tbl.integer('farmID', 255)
            .unsigned()
            .notNullable()
            .references('id')
            .inTable('farms')
        tbl.integer('productID', 255)
            .unsigned()
            .notNullable()
            .references('id')
            .inTable('products')
        tbl.string('measurementType', 255)
            .notNullable();
        tbl.integer('quantity', 255)
            .unsigned()
            .notNullable();
        tbl.integer('price', 255)
            .unsigned()
            .notNullable();
    })
};

exports.down = function(knex) {
    return knex.schema.dropTableIfExists('supply');
};

//supply
// farmID required
// productID required
// string measurement type (pounds, ounces, etc) required
// int quantity required
// int price required