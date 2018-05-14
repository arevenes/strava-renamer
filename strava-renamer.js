const strava = require('strava-v3');
const config = require('./config');
const mapping = require('./mapping');
const moment = require('moment');
const checkInterval = config.interval || 60000;
const nrOfActivities = config.nrOfActivities || 1;

const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

const isCompleteUpdate = (update) => {
  return update.from && update.to && update.name
};

const startChecking = () => {
  const now = moment().format();
  console.log(`---------------------------${now}---------------------------`);
  strava.athlete.listActivities({...config, per_page: nrOfActivities},function(err,payload,limits) {
      const updates = [];
      if(!err && payload) {
          payload.forEach(a => {
            const update = {};
            const startLat = a.start_latlng[0];
            const startLong = a.start_latlng[1];
            const endLat = a.end_latlng[0];
            const endLong = a.end_latlng[1];
            mapping.forEach(m => {
              if (startLat === m.lat && startLong === m.long) {
                update.from = m.name;
              }
              if (endLat === m.lat && endLong === m.long) {
                update.to = m.name;
              }
            });
            if (update.from && update.to) {
              update.name = capitalizeFirstLetter(`${update.from} to ${update.to}`);
              update.id = a.id;
              if (moment(a.start_date).isSame(moment.now(), 'day') && (a.name !== update.name && !a.name.endsWith('!'))) {
                updates.push(update);
              }
            }
          });
          updates.forEach(update => {
            if (isCompleteUpdate(update)) {
              console.log(`UPDATE READY FOR ACTIVITY: ${update.id}: ${update.name}`);
              strava.activities.update({...config, id: update.id, name: update.name, description: config.description }, (err, payload, limits) => {
               if (!err) {
                 console.log(`UPDATED ACTIVITY: ${update.id} SUCCESSFULLY`);
               } else {
                 console.log(`ISSUE UPDATING ACTIVITY ${update.id}`, err);
               }
             });
            }
          });
      }
      else {
          console.log(err);
      }
  });
}

if (process.argv[2] === 'listactivities') {
  console.log('Your 100 last activites:');
  strava.athlete.listActivities({...config, per_page: 100},function(err,payload,limits) {
    payload.forEach(a => {
      console.log(`name: ${a.name}, startLat/Lng: ${a.start_latlng[0]}/${a.start_latlng[1]}, endLat/Lng: ${a.end_latlng[0]}/${a.end_latlng[1]}`)
    });
  });
} else {
  console.log(`Started looking for ${nrOfActivities} activities... interval is every ${checkInterval / 1000} seconds`);
  startChecking();
  setInterval(startChecking, checkInterval);
}
