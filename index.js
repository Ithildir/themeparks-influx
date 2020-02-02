const influx = require('./influx');
const themeparks = require('./themeparks');

const INTERVAL_MINS = parseInt(process.env.INTERVAL_MINS, 10) || 5;

async function getWaitTimePoints(themepark) {
  const startTime = Date.now();

  const rides = await themepark.GetWaitTimes();

  console.info(
    `Retrieved wait times for ${themepark.Name} in ${Date.now() - startTime}ms`
  );

  console.log(typeof rides[0].lastUpdate);

  return rides.map(ride => ({
    measurement: 'wait_time',
    fields: {
      active: ride.active,
      wait_time: ride.waitTime,
    },
    tags: {
      park_name: themepark.Name,
      ride_name: ride.name,
    },
    timestamp: (ride.lastUpdate && ride.lastUpdate.getTime()) || startTime,
  }));
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
