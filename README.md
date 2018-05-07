# Strava renamer
This application will fetch one or more (configurable) of your latest activities and rename them based on what you want. An example could be that you always commute to work and you want that activity to be named "Home to work". You might also want to name the other direction "Work to home". This application will fetch the activity and rename it for you at a given interval. The application will only rename an activity if all these hold true:
* title is not already updated by strava renamer (same title before as the one generated)
* title does not end with ! (add ! to your activity if you don't want it touched)
* activity is done the same day
* strava renamer can successfully find both the start and end location in the mapping (going from one known location to another unknown location will not be updated)

Text created will be `Location to location`, ex `Home to work`. First letter will be capitalized.

## Prerequisites:
* Nodejs (8.11.1 if possible)

## Installation:
* npm install
* Add files config.json and mapping.json as described below

## Configuration:
* You must add two files manually, config.json and mapping.json

## config.json with example
```
{
    "access_token"    :"your access token (strava)"
    , "client_id"     : your client id (strava)
    , "client_secret" :"your client secret (strava)"
    , "redirect_uri"  :"Your apps Authorization Redirection URI (not needed for this application)",
    "interval": how often do to poll for activities in ms,
    "nrOfActivities": how many activites do you want to rename at a time,
    "description": "description to be added to all events populated by this application"
}
```
Add config.json to your main folder (same folder as strava-renamer.js). Beware that your access token will need to have write permission to be able to update the activities. A guide on how to obtain a token with write permission can be found here -> http://yizeng.me/2017/01/11/get-a-strava-api-access-token-with-write-permission/
client_id, client_secret can be found in your Strava profile (My API Application)

## mapping.json with example
```
[
  {
    "lat": 23.27,
    "long": 15.34,
    "name": "home"
  },
  {
    "lat": 32.11,
    "long": 15.10,
    "name": "work"
  },
  {
    "lat": 13.39,
    "long": 13.33,
    "name": "workout"
  }
]
```
## Obtaining/generating the mapping
Add mapping.json to your main folder (same folder as strava-renamer.js). To obtain/create your mapping you can start the application like below:

``node strava-renamer.js listactivities``

This will list your 100 last activities (name, start latitude/longitude and end latitude/longitude). Based on that you should be able to dictate your favorite mapping locations. If not, go to your Strava account and add descriptive titles for a couple of them so you can recognize the gps locations. This command should work without write permission in your access token.

# Running the application
``node strava-renamer.js``
