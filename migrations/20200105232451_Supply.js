
exports.up = function(knex) {
    return knex.schema.createTable('supply', tbl => {
        tbl.increments();
        tbl.integer('farmID', 255)
            .notNullable(),
        tbl.integer('productID', 255)
            .notNullable(),
        tbl.string('measurementType', 255)
            .notNullable();
        tbl.integer('quantity', 255)
            .notNullable();
        tbl.integer('price', 255)
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