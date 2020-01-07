
exports.up = function(knex) {
    return knex.schema.createTable('farmOwner', tbl => {
        tbl.integer('farmID', 255)
            .unsigned()
            .notNullable()
            .references('id')
            .inTable('farms')
        tbl.integer('ownerID', 255)
            .unsigned()
            .notNullable()
            .references('id')
            .inTable('users')
        tbl.primary(['farmID', 'ownerID'])
    })
};

exports.down = function(knex) {
    return knex.schema.dropTableIfExists('farmOwner');
};
