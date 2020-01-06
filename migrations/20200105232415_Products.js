
exports.up = function(knex) {
    return knex.schema.createTable('products', tbl => {
        tbl.increments();
        tbl.string('name', 255)
            .notNullable();
        tbl.string('description', 255)
            .notNullable();
        tbl.string('imageURL', 255)
    })
};

exports.down = function(knex) {
    return knex.schema.dropTableIfExists('products');
};

//products
// id
// name required
// description required
// imageURL optional