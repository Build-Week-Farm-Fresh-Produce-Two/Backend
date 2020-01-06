
exports.up = function(knex) {
  
};

exports.down = function(knex) {
  
};

//users
// id
// int farmID optional, required if isFarmer true
// bool isFarmer required
// string username required
// string password required
// string name required
// 5 digit zip code required
// address optional

//farms
// id
// ownerUserID required
// name required
// address required
// 5 digit zip code required

//products
// id
// name required
// description required
// imageURL optional

//supply
// farmID required
// productID required
// string measurement type (pounds, ounces, etc) required
// int quantity required
// int price required

//orders
// id
// int farmID required
// int customerID required
// int total price required
// bool paymentStatus required
// bool fulfillmentStatus required 

//orderedProducts
// orderID required
// productID required
