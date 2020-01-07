
exports.seed = function(knex) {
  return knex('orderedProducts').insert([
    {orderID: 1, supplyID: 1, quantity: 1},
    {orderID: 1, supplyID: 1, quantity: 1},
    {orderID: 1, supplyID: 1, quantity: 1},
    {orderID: 1, supplyID: 1, quantity: 1},
    {orderID: 1, supplyID: 1, quantity: 1},
    {orderID: 1, supplyID: 1, quantity: 1},
    {orderID: 1, supplyID: 1, quantity: 1},
    {orderID: 1, supplyID: 1, quantity: 1},
  ], 'id');
};
