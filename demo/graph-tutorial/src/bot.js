// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

require('dotenv').config();

const { ActivityHandler, TurnContext } = require('botbuilder');

class EchoBot extends ActivityHandler {
    constructor() {
        super();
        // See https://aka.ms/about-bot-activity-message to learn more about the message and other activity types.
        this.onMessage(async (context, next) => {
            await context.sendActivity(`You said **${ context.activity.text.toUpperCase() }** at ${new Date()}`);

            const conversationReference = TurnContext.getConversationReference(context.activity);
            console.log(JSON.stringify(conversationReference));

            // By calling next() you ensure that the next BotHandler is run.
            await next();
        });

        this.onMembersAdded(async (context, next) => {
            const membersAdded = context.activity.membersAdded;
            for (let cnt = 0; cnt < membersAdded.length; ++cnt) {
                if (membersAdded[cnt].id !== context.activity.recipient.id) {
                    await context.sendActivity(`Hello and welcome! <${process.env.ORIGIN_URL}/auth/signin>`);
                }
            }
            // By calling next() you ensure that the next BotHandler is run.
            await next();
        });
    }
}

module.exports.EchoBot = EchoBot;
