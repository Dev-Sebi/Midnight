"use strict";
console.clear()
require("dotenv").config();
const Discord = require("discord.js");
const client = new Discord.Client({
  intents: [
    "GUILDS",
    "GUILD_MEMBERS",
    "GUILD_EMOJIS_AND_STICKERS",
    "GUILD_MESSAGES",
  ],
});
module.exports = client;

client.ArrayOfApplicationCommands = new Discord.Collection();

require("./handler")(client);

client.login(process.env.TOKEN);
