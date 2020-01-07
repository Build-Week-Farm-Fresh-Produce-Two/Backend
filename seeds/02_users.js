
exports.seed = function(knex) {
  return knex('users').insert([
    {id: 1, farmID: 1, email: 'bestfarmer@farm.com', username: 'bestfarmer', password: 'pass', name: 'jim best', addressStreet: '443 48th ST', addressCity: 'Seattle', addressState: 'WA', zipCode: 54321},
    {id: 2, farmID: 3, email: 'farmerfred@gmail.com', username: 'farmerfred', password: 'pass', name: 'farmer fred', zipCode: 22222},
    {id: 3, farmID: 2, email: 'worstfarmer@farm.com', username: 'worstfarmer', password: 'pass', name: 'jim worst', zipCode: 18231},
  ]);
};