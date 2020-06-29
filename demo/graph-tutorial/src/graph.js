// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

var graph = require('@microsoft/microsoft-graph-client');
require('isomorphic-fetch');

module.exports = {
    getUserDetails: async function(accessToken) {
        const client = getAuthenticatedClient(accessToken);

        const user = await client.api('/me').get();
        return user;
    },

    // <GetEventsSnippet>
    getEvents: async function(accessToken) {
        const client = getAuthenticatedClient(accessToken);

        const events = await client
            .api('/me/events')
            .select('subject,organizer,start,end')
            .orderby('createdDateTime DESC')
            .get();

        return events;
    },
    // </GetEventsSnippet>

    getChats: async function(accessToken) {
        const client = getAuthenticatedClient(accessToken);

        const chats = await client
            .api('/me/chats')
            .version('beta')
            .get();

        return chats;
    },

    getConversationMembers: async function(accessToken, chatId) {
        const client = getAuthenticatedClient(accessToken);

        const members = await client
            .api(`/me/chats/${chatId}/members`)
            .version('beta')
            .get();

        return members;
    },

    getChatMessages: async function(accessToken, chatId) {
        const client = getAuthenticatedClient(accessToken);

        const members = await client
            .api(`/me/chats/${chatId}/messages`)
            .version('beta')
            .get();

        return members;
    }
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
