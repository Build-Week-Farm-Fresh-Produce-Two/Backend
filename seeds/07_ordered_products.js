
exports.seed = function(knex) {
  return knex('orderedProducts').insert([
    {orderID: 1, supplyID: 1, productName: 'testProductName 1', productDescription: 'testDesc 1', purchasedMeasurementType: 'Pounds', purchasedQuantity: 700, purchasedPrice: 10.99 },
    {orderID: 1, supplyID: 2, productName: 'testProductName 2', productDescription: 'testDesc 2', purchasedMeasurementType: 'Pounds', purchasedQuantity: 3, purchasedPrice: 3 },
    {orderID: 1, supplyID: 3, productName: 'testProductName 3', productDescription: 'testDesc 3', purchasedMeasurementType: 'Pounds', purchasedQuantity: 3, purchasedPrice: 5 },
    {orderID: 2, supplyID: 1, productName: 'testProductName 1', productDescription: 'testDesc 1', purchasedMeasurementType: 'Pounds', purchasedQuantity: 1, purchasedPrice: 1 },
    {orderID: 3, supplyID: 1, productName: 'testProductName 1', productDescription: 'testDesc 1', purchasedMeasurementType: 'Pounds', purchasedQuantity: 1, purchasedPrice: 1 },
    {orderID: 4, supplyID: 1, productName: 'testProductName 1', productDescription: 'testDesc 1', purchasedMeasurementType: 'Pounds', purchasedQuantity: 1, purchasedPrice: 1 },
    {orderID: 5, supplyID: 1, productName: 'testProductName 1', productDescription: 'testDesc 1', purchasedMeasurementType: 'Pounds', purchasedQuantity: 1, purchasedPrice: 1 },
    {orderID: 6, supplyID: 1, productName: 'testProductName 1', productDescription: 'testDesc 1', purchasedMeasurementType: 'Pounds', purchasedQuantity: 1, purchasedPrice: 1 },
  ], 'id');
};
