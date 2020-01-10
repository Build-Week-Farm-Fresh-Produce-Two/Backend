
exports.seed = function(knex) {
  return knex('orders').insert([
    {farmID: 1, customerID: 1, farmName: 'best farm', customerName: 'jim best', totalPrice: 3.99, paymentStatus: true, fulfillmentStatus: true },
    {farmID: 1, customerID: 3, farmName: 'best farm', customerName: 'jim worst', totalPrice: 20, paymentStatus: true, fulfillmentStatus: false },
    {farmID: 1, customerID: 2, farmName: 'best farm', customerName: 'farmer fred', totalPrice: 23, paymentStatus: true, fulfillmentStatus: false },
    {farmID: 2, customerID: 3, farmName: 'second best farm', customerName: 'jim worst', totalPrice: 3.99, paymentStatus: true, fulfillmentStatus: false },
    {farmID: 2, customerID: 3, farmName: 'second best farm', customerName: 'jim worst', totalPrice: 3.99, paymentStatus: true, fulfillmentStatus: false },
    {farmID: 3, customerID: 2, farmName: 'worst farm', customerName: 'farmer fred', totalPrice: 3.99, paymentStatus: true, fulfillmentStatus: false },
  ], 'id');
};
