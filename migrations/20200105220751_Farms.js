
exports.up = function(knex) {
    return knex.schema.createTable('farms', tbl => {
        tbl.increments();
        tbl.string('name', 255)
            .notNullable();
        tbl.string('addressStreet', 255)
            .notNullable();
        tbl.string('addressCity', 255)
            .notNullable();
        tbl.string('addressState', 255)
            .notNullable();
        tbl.integer('zipCode', 255)
            .unsigned()
            .notNullable();
    })
};

exports.down = function(knex) {
    return knex.schema.dropTableIfExists('farms');
};

//farms
// id
// ownerUserID required
// name required
// address street required
// address city required
// address state required
// 5 digit zip code required
