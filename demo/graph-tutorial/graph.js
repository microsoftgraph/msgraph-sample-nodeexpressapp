// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

var graph = require('@microsoft/microsoft-graph-client');
require('isomorphic-fetch');

module.exports = {
  getUserDetails: async function(accessToken) {
    const client = getAuthenticatedClient(accessToken);

    const user = await client
      .api('/me')
      .select('displayName,mail,mailboxSettings,userPrincipalName')
      .get();
    return user;
  },

  // <GetCalendarViewSnippet>
  getCalendarView: async function(accessToken, start, end, timeZone) {
    const client = getAuthenticatedClient(accessToken);

    const events = await client
      .api('/me/calendarview')
      // Add Prefer header to get back times in user's timezone
      .header("Prefer", `outlook.timezone="${timeZone}"`)
      // Add the begin and end of the calendar window
      .query({ startDateTime: start, endDateTime: end })
      // Get just the properties used by the app
      .select('subject,organizer,start,end')
      // Order by start time
      .orderby('start/dateTime')
      // Get at most 50 results
      .top(50)
      .get();

    return events;
  },
  // </GetCalendarViewSnippet>
};

function getAuthenticatedClient(accessToken) {
  // Initialize Graph client
  const client = graph.Client.init({
    // Use the provided access token to authenticate
    // requests
    authProvider: (done) => {
      done(null, accessToken);
    }
  });

  return client;
}
