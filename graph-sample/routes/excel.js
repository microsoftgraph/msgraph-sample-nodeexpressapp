// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

const router = require('express-promise-router').default();
const graph = require('../graph.js');
const dateFns = require('date-fns');
const zonedTimeToUtc = require('date-fns-tz/zonedTimeToUtc');
const iana = require('windows-iana');
const { body, validationResult } = require('express-validator');
const validator = require('validator');

/* GET /calendar */
// <GetRouteSnippet>
router.get('/',
  async function(req, res) {
    if (!req.session.userId) {
      // Redirect unauthenticated requests to home page
      res.redirect('/');
    } else {
      const params = {
        active: { calendar: true }
      };

      // Get the user
      const user = req.app.locals.users[req.session.userId];
      // Convert user's Windows time zone ("Pacific Standard Time")
      // to IANA format ("America/Los_Angeles")
      const timeZoneId = iana.findIana(user.timeZone)[0];
      console.log(`Time zone: ${timeZoneId.valueOf()}`);

      try {
        // Get the events
        const files = await graph.getDriveItems(
          req.app.locals.msalClient,
          req.session.userId);

        // Assign the events to the view parameters
        params.events = files.value;
      } catch (err) {
        req.flash('error_msg', {
          message: 'Could not fetch events',
          debug: JSON.stringify(err, Object.getOwnPropertyNames(err))
        });
      }

      res.render('excel', params);
    }
  }
);
// </GetRouteSnippet>

// </GetEventFormSnippet>
// <PostEventFormSnippet>
/* POST /calendar/new */
// </PostEventFormSnippet>
module.exports = router;
