
exports.seed = function(knex) {
  return knex('farmOwner').insert([
    {farmID: 1, ownerID: 1},
    {farmID: 2, ownerID: 2},
    {farmID: 3, ownerID: 3},
  ]);
};
