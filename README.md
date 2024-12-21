# EternalRealmZ Bot V1

- [README.md](README.md)
- [TODO.md](TODO.md)
- [CHANGELOG.md](CHANGELOG.md)

## What is this bot?

There should also be a WIKI for this bot somewhere, when i make it, i will link it here somewhere.

This bot will always be open source, there are a few pieces of information that are hidden but it's information that is private to mefor the database or hosting.

<p>The concept for this bot is a multi-guild bot for use within DayZ Discord Servers both private and public.

There will be systems within the bot that are intended for private usage. I.E. Custom solutions to custom requirnements, but accessible and togglable to all users of the bot. If the feature is too large, a seperate bot maybe made.

## What does this bot use?

<li>Discord.js version 14.16.3
<li>MongoDB (database)

## Expectations for Version 1

<ul>
<li>Change Log System
<li>Welcome/Leave System
</ul>

## What data is stored on the database?

Below i will try to list every single peice of information that is contained on the database but nothing personal is the general gist. As this is open source, you yourself can go through and see that nothing personal is used by the bot. I only use the user id which is public information, it uniquely identifiers a user and thats it.

<li>User ID | Used to identify a singular user. People can have the same name, but every users id is seperate and public
<li>Guild ID | Used to identify each guild. One user might be in two or more guilds using this bot, and each guild may have different settings for this bot, i need to store those settings to something unique that identifies that server.

## What does the bot need admin?

simply put, im too dumb to figure out what intents i should provide to it as i don't actually know what features i plan to add and thus don't know what intents are required.
