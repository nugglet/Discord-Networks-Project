# Discord-Networks-Project

## About
This project aims to measure Discord VOIP call quality in their voice channels through the use of a sender and receiver bot.

Development of each bot will be in their respective branches: 'sender' and 'receiver'

## Requirements
Node: v16.0.0 and above

## Testing
To test the bot, please create two bots using the Discord Developer Dashboard and add the required tokens to a .env file for each of the sender_bot and reciever_bot directories. After that, please invite the bot to your server. Ensure it has administrator permissions, and under the 'scopes' tab, ensure the 'bot' and 'applications.commands' fields are checked. Follow the link generated to add the bot to your desired server.

The .env file will look like so:

in ./receiver_bot
```
RECV_CLIENT_ID=*
RECV_BOT_TOKEN=*

# your server information
BOT_CHANNEL_ID=*
GUILD_ID=*

```

in ./sender_bot
```
SENDER_BOT_TOKEN=*
SENDER_BOT_CLIENT_ID=*

# your server information
BOT_CHANNEL_ID=*
GUILD_ID=*
```

Clone the project.

## Sender Bot Usage

use `cd sender_bot`
run `node sender.js`

## Receiver Bot Usage

use `cd receiver_bot`
run `npm start`

If successful, the bot should appear online in your server.