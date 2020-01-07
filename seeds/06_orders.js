
exports.seed = function(knex) {
  return knex('orders').insert([
    {farmID: 1, customerID: 1, totalPrice: 3.99, paymentStatus: true, fulfillmentStatus: true },
    {farmID: 1, customerID: 3, totalPrice: 20, paymentStatus: true, fulfillmentStatus: false },
    {farmID: 1, customerID: 2, totalPrice: 23, paymentStatus: true, fulfillmentStatus: false },
    {farmID: 2, customerID: 3, totalPrice: 3.99, paymentStatus: true, fulfillmentStatus: false },
    {farmID: 2, customerID: 3, totalPrice: 3.99, paymentStatus: true, fulfillmentStatus: false },
    {farmID: 3, customerID: 2, totalPrice: 3.99, paymentStatus: true, fulfillmentStatus: false },
  ], 'id');
};
