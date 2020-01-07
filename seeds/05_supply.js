
exports.seed = function(knex) {
  return knex('supply').insert([
    {farmID: 1, productID: 1, measurementType: 'pounds', quantity: 100, price: 3.99},
    {farmID: 1, productID: 2, measurementType: 'pounds', quantity: 25, price: 2.00},
    {farmID: 1, productID: 3, measurementType: 'pounds', quantity: 30, price: 5.56},
    {farmID: 2, productID: 2, measurementType: 'pounds', quantity: 7, price: 2.50},
    {farmID: 2, productID: 3, measurementType: 'pounds', quantity: 20, price: 4.75},
    {farmID: 3, productID: 1, measurementType: 'pounds', quantity: 40, price: 3.75},
    {farmID: 3, productID: 2, measurementType: 'pounds', quantity: 200, price: 1.90},
    {farmID: 3, productID: 3, measurementType: 'pounds', quantity: 55, price: 6.00},
  ], 'id');
};
