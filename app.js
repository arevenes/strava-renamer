const strava = require('strava-v3');
const config = require('./config');
const mapping = require('./mapping');
const checkInterval = config.interval || 60000;
const nrOfActivities = config.nrOfActivities || 1;

const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

const isCompleteUpdate = (update) => {
  return update.from && update.to && update.name
};

const startChecking = () => {
  strava.athlete.listActivities({...config, per_page: 1},function(err,payload,limits) {
      const updates = [];
      if(!err) {
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
              updates.push(update);
            }
          });
          updates.forEach(update => {
            if (isCompleteUpdate(update)) {
              console.log(`UPDATE READY FOR ACTIVITY: ${update.id}: ${update.name}`);
              strava.activities.update({...config, id: update.id, name: update.name }, (err, payload, limits) => {
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
console.log(`Started looking for ${nrOfActivities} activities... interval is every ${checkInterval / 1000} seconds`);
startChecking();
setInterval(startChecking, checkInterval);
