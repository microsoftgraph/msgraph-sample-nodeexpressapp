// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

var graph = require('@microsoft/microsoft-graph-client');
require('isomorphic-fetch');

module.exports = {
  getUserDetails: async function(msalClient, userId) {
    const client = getAuthenticatedClient(msalClient, userId);

    const user = await client
      .api('/me')
      .select('displayName,mail,mailboxSettings,userPrincipalName')
      .get();
    return user;
  },
  getDriveItems: async function(msalClient, userId) {
    const client = getAuthenticatedClient(msalClient, userId);

    return client
      .api('/me/drive/items/132EB664B78CC9B1!127/workbook/worksheets')
      // Add Prefer header to get back times in user's timezone
      // .header('Prefer', `outlook.timezone="${timeZone}"`)
      // // Add the begin and end of the calendar window
      // .query({
      //   startDateTime: encodeURIComponent(start),
      //   endDateTime: encodeURIComponent(end)
      // })
      // Get just the properties used by the app
      // .select('subject,organizer,start,end')
      // Order by start time
      // .orderby('start/dateTime')
      // Get at most 50 results
      .get();
  },

  // <GetCalendarViewSnippet>
  getCalendarView: async function(msalClient, userId, start, end, timeZone) {
    const client = getAuthenticatedClient(msalClient, userId);

    return client
      .api('/me/calendarview')
      // Add Prefer header to get back times in user's timezone
      .header('Prefer', `outlook.timezone="${timeZone}"`)
      // Add the begin and end of the calendar window
      .query({
        startDateTime: encodeURIComponent(start),
        endDateTime: encodeURIComponent(end)
      })
      // Get just the properties used by the app
      .select('subject,organizer,start,end')
      // Order by start time
      .orderby('start/dateTime')
      // Get at most 50 results
      .top(50)
      .get();
  },
  // </GetCalendarViewSnippet>
  // <CreateEventSnippet>
  createEvent: async function(msalClient, userId, formData, timeZone) {
    const client = getAuthenticatedClient(msalClient, userId);

    // Build a Graph event
    const newEvent = {
      subject: formData.subject,
      start: {
        dateTime: formData.start,
        timeZone: timeZone
      },
      end: {
        dateTime: formData.end,
        timeZone: timeZone
      },
      body: {
        contentType: 'text',
        content: formData.body
      }
    };

    // Add attendees if present
    if (formData.attendees) {
      newEvent.attendees = [];
      formData.attendees.forEach(attendee => {
        newEvent.attendees.push({
          type: 'required',
          emailAddress: {
            address: attendee
          }
        });
      });
    }

    // POST /me/events
    await client
      .api('/me/events')
      .post(newEvent);
  },
  // </CreateEventSnippet>

};

function getAuthenticatedClient(msalClient, userId) {
  if (!msalClient || !userId) {
    throw new Error(
      `Invalid MSAL state. Client: ${msalClient ? 'present' : 'missing'}, User ID: ${userId ? 'present' : 'missing'}`);
  }

  // Initialize Graph client
  const client = graph.Client.init({
    // Implement an auth provider that gets a token
    // from the app's MSAL instance
    authProvider: async (done) => {
      try {
        // Get the user's account
        const account = await msalClient
          .getTokenCache()
          .getAccountByHomeId(userId);

        if (account) {
          // Attempt to get the token silently
          // This method uses the token cache and
          // refreshes expired tokens as needed
          const scopes = process.env.OAUTH_SCOPES || 'https://graph.microsoft.com/.default';
          const response = await msalClient.acquireTokenSilent({
            scopes: scopes.split(','),
            redirectUri: process.env.OAUTH_REDIRECT_URI,
            account: account
          });

          // First param to callback is the error,
          // Set to null in success case
          done(null, response.accessToken);
        }
      } catch (err) {
        console.log(JSON.stringify(err, Object.getOwnPropertyNames(err)));
        done(err, null);
      }
    }
  });

  return client;
}
