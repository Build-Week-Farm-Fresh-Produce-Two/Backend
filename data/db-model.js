const db = require('./db-config.js');

module.exports = {
    findBy,
    findByMultiple,
    findById,
    add,
    update,
    remove,
}

function findBy(table, value){
    return db(table)
        .where(value)
        .first();
}

function findByMultiple(table, value1, value2){
    // console.log(value1, value2)
    return db(table)
        .where({...value1, ...value2})
}

function add(table, row){
    console.log('DB Add: ', table, row)
    return db(table)
    .insert({...row}, 'id');
}

function findById(table, id){
    return db(`${table} as t`)
    .where({'t.id': id})
    .select('t.*')
    .first();
}

function update(table, id, row){
    return db(table)
    .where({id})
    .update({...row});
}

async function remove(table, id){
    await db.transaction(async trx => {
        try{
             await trx(table)
            .where({id});

            const rowDeleted = await trx(table)
            .where({id})
            .del();
            
            if(!rowDeleted){
                throw `Error deleting row from ${table}`
            }

            return true;
        }catch(err){
            throw err;
        }
    });
}