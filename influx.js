const Influx = require('influx');

const {
  INFLUX_DATABASE = 'themeparks',
  INFLUX_HOST = 'localhost',
  INFLUX_USERNAME = 'themeparks',
  INFLUX_PASSWORD,
} = process.env;

const INFLUX_PORT = parseInt(process.env.INFLUX_PORT, 10) || 8086;

const client = new Influx.InfluxDB({
  database: INFLUX_DATABASE,
  host: INFLUX_HOST,
  port: INFLUX_PORT,
  username: INFLUX_USERNAME,
  password: INFLUX_PASSWORD,
  schema: [
    {
      measurement: 'wait_time',
      fields: {
        value: Influx.FieldType.INTEGER,
      },
      tags: ['active', 'park_name', 'ride_name'],
    },
  ],
});

module.exports = client;
