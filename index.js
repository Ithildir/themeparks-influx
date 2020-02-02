/* eslint-disable no-console */
const influx = require('./influx');
const themeparks = require('./themeparks');

const INTERVAL_MINS = parseInt(process.env.INTERVAL_MINS, 10) || 5;

async function getWaitTimePoints(themepark) {
  const startDate = new Date();

  const rides = await themepark.GetWaitTimes();

  console.info(
    `Retrieved wait times for ${themepark.Name} in ${Date.now() -
      startDate.getTime()}ms`
  );

  return rides.map(ride => {
    let timestamp = startDate;

    if (typeof ride.lastUpdate === 'string') {
      timestamp = new Date(ride.lastUpdate);
    }

    return {
      measurement: 'wait_time',
      fields: {
        value: ride.waitTime,
      },
      tags: {
        active: ride.active,
        park_name: themepark.Name,
        ride_name: ride.name,
      },
      timestamp,
    };
  });
}

async function saveWaitTimes() {
  try {
    const pointsArrays = await Promise.all(
      Object.values(themeparks).map(getWaitTimePoints)
    );

    const points = pointsArrays.flat();

    await influx.writePoints(points);

    console.log(`Correctly saved ${points.length} wait times to InfluxDB`);
  } catch (err) {
    console.error(err);
  }
}

setInterval(saveWaitTimes, INTERVAL_MINS * 60 * 1000);

saveWaitTimes();
