
exports.up = function(knex) {
    return knex.schema.createTable('users', tbl => {
        tbl.increments();
        tbl.integer('farmID', 255)
            .unsigned()
            .references('id')
            .inTable('farms')
            .onDelete('SET NULL')
        tbl.boolean('isFarmer', 255)
            .notNullable();
        tbl.string('email', 255)
            .notNullable()
            .unique(); 
        tbl.string('username', 255)
            .notNullable()
            .unique(); 
        tbl.string('password', 255)
            .notNullable();
        tbl.string('name', 255)
            .notNullable();
        tbl.integer('zipCode', 255)
            .unsigned()
            .notNullable();
        tbl.string('addressStreet', 255)
        tbl.string('addressCity', 255)
        tbl.string('addressState', 255)
    })
};

exports.down = function(knex) {
    return knex.schema.dropTableIfExists('users');
};

//users
// id
// int farmID optional, required if isFarmer true
// bool isFarmer required
// string email required unique
// string username required unique
// string password required
// string name required
// 5 digit zip code required
// address street optional
// address city optional
// address state optional