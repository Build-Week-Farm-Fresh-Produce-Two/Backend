
exports.seed = function(knex) {
  return knex('products').insert([
    {name: 'Strawberry', description: 'tasty red fruit', imageURL: 'https://www.aces.edu/wp-content/uploads/2019/04/strawberry-.jpg'},
    {name: 'potato', description: 'you could make french fries', },
    {name: 'Lettuce', description: 'main ingredient for salads'},
  ], 'id');
};
