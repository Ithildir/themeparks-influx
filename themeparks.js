const Themeparks = require('themeparks');

const { CACHE_DB, PARKS } = process.env;

if (CACHE_DB) {
  Themeparks.Settings.Cache = CACHE_DB;
}

const parks = PARKS.split(',').reduce(
  (agg, name) => ({
    ...agg,
    [name]: new Themeparks.Parks[name](),
  }),
  {}
);

module.exports = parks;
