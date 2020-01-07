
exports.up = function(knex) {
    return knex.schema.createTable('farmOwner', tbl => {
        tbl.increments();
        tbl.integer('farmID', 255)
            .unsigned()
            .notNullable()
            .references('id')
            .inTable('farms')
            .onDelete('CASCADE')
        tbl.integer('ownerID', 255)
            .unsigned()
            .references('id')
            .inTable('users')
            .onDelete('SET NULL')
    })
};

exports.down = function(knex) {
    return knex.schema.dropTableIfExists('farmOwner');
};
