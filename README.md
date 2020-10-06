# DiscordStakeBot

A Discord bot with a command that lets users stake each other. Features graphical staking using dynamically generated images.

![Image of Graphical Staking Message](https://i.imgur.com/GVNbukq.png)

## Setup

#### Token
You need to add your bot's client token to `auth.json` and then uncomment the entry in the `.gitignore` file to prevent it from being leaked.
This will allow you to easily run your bot locally. Remote deploys should provide the token securely using an environment variable called `BOT_TOKEN`.

## Deploying
Run `npm start` to start the bot.



