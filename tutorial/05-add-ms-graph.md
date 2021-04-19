<!-- markdownlint-disable MD002 MD041 -->

In this exercise you will incorporate Microsoft Graph into the application. For this application, you will use the [microsoft-graph-client](https://github.com/microsoftgraph/msgraph-sdk-javascript) library to make calls to Microsoft Graph.

## Get calendar events from Outlook

1. Open **./graph.js** and add the following function inside `module.exports`.

    :::code language="javascript" source="../demo/graph-tutorial/graph.js" id="GetCalendarViewSnippet":::

    Consider what this code is doing.

    - The URL that will be called is `/me/calendarview`.
    - The `header` method adds the `Prefer: outlook.timezone` header to the request, causing the start and end times to be returned in the user's time zone.
    - The `query` method sets the `startDateTime` and `endDateTime` parameters for the calendar view.
    - The `select` method limits the fields returned for each events to just those the view will actually use.
    - The `orderby` method sorts the results by the start time.
    - The `top` method limits the results to 50 events.

1. Create a new file in the **./routes** directory named **calendar.js**, and add the following code.

    ```javascript
    const router = require('express-promise-router')();
    const graph = require('../graph.js');
    const addDays = require('date-fns/addDays');
    const formatISO = require('date-fns/formatISO');
    const startOfWeek = require('date-fns/startOfWeek');
    const zonedTimeToUtc = require('date-fns-tz/zonedTimeToUtc');
    const iana = require('windows-iana');
    const { body, validationResult } = require('express-validator');
    const validator = require('validator');

    /* GET /calendar */
    router.get('/',
      async function(req, res) {
        if (!req.session.userId) {
          // Redirect unauthenticated requests to home page
          res.redirect('/')
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

          // Calculate the start and end of the current week
          // Get midnight on the start of the current week in the user's timezone,
          // but in UTC. For example, for Pacific Standard Time, the time value would be
          // 07:00:00Z
          var weekStart = zonedTimeToUtc(startOfWeek(new Date()), timeZoneId.valueOf());
          var weekEnd = addDays(weekStart, 7);
          console.log(`Start: ${formatISO(weekStart)}`);

          // Get the access token
          var accessToken;
          try {
            accessToken = await getAccessToken(req.session.userId, req.app.locals.msalClient);
          } catch (err) {
            res.send(JSON.stringify(err, Object.getOwnPropertyNames(err)));
            return;
          }

          if (accessToken && accessToken.length > 0) {
            try {
              // Get the events
              const events = await graph.getCalendarView(
                accessToken,
                formatISO(weekStart),
                formatISO(weekEnd),
                user.timeZone);

              res.json(events.value);
            } catch (err) {
              res.send(JSON.stringify(err, Object.getOwnPropertyNames(err)));
            }
          }
          else {
            req.flash('error_msg', 'Could not get an access token');
          }
        }
      }
    );

    async function getAccessToken(userId, msalClient) {
      // Look up the user's account in the cache
      try {
        const accounts = await msalClient
          .getTokenCache()
          .getAllAccounts();

        const userAccount = accounts.find(a => a.homeAccountId === userId);

        // Get the token silently
        const response = await msalClient.acquireTokenSilent({
          scopes: process.env.OAUTH_SCOPES.split(','),
          redirectUri: process.env.OAUTH_REDIRECT_URI,
          account: userAccount
        });

        return response.accessToken;
      } catch (err) {
        console.log(JSON.stringify(err, Object.getOwnPropertyNames(err)));
      }
    }

    module.exports = router;
    ```

1. Update **./app.js** to use this new route. Add the following line **before** the `var app = express();` line.

    ```javascript
    var calendarRouter = require('./routes/calendar');
    ```

1. Add the following line **after** the `app.use('/auth', authRouter);` line.

    ```javascript
    app.use('/calendar', calendarRouter);
    ```

1. Restart the server. Sign in and click the **Calendar** link in the nav bar. If everything works, you should see a JSON dump of events on the user's calendar.

## Display the results

Now you can add a view to display the results in a more user-friendly manner.

1. Add the following code in **./app.js after** the `app.set('view engine', 'hbs');` line.

    :::code language="javascript" source="../demo/graph-tutorial/app.js" id="FormatDateSnippet":::

    This implements a [Handlebars helper](http://handlebarsjs.com/#helpers) to format the ISO 8601 date returned by Microsoft Graph into something more human-friendly.

1. Create a new file in the **./views** directory named **calendar.hbs** and add the following code.

    :::code language="html" source="../demo/graph-tutorial/views/calendar.hbs" id="LayoutSnippet":::

    That will loop through a collection of events and add a table row for each one.

1. Now update the route in **./routes/calendar.js** to use this view. Replace the existing route with the following code.

    :::code language="javascript" source="../demo/graph-tutorial/routes/calendar.js" id="GetRouteSnippet" highlight="33-36,49,51-54,61":::

1. Save your changes, restart the server, and sign in to the app. Click on the **Calendar** link and the app should now render a table of events.

    ![A screenshot of the table of events](./images/add-msgraph-01.png)
