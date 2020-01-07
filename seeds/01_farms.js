
exports.seed = function(knex) {
  return knex('farms').insert([
    {id: 1, name: 'best farm', addressStreet: '123 4th ST', addressCity: 'Seattle', addressState: 'WA', zipCode: 12345, },
    {id: 2, name: 'second best farm', addressStreet: '221B Baker ST', addressCity: 'Seattle', addressState: 'WA', zipCode: 12345, },
    {id: 3, name: 'worst farm', addressStreet: '432 1st ST', addressCity: 'Seattle', addressState: 'WA', zipCode: 12345, },
  ]);
};