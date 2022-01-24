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


const express = require('express')
const app = express()
const port = 1000

app.post('/stats', (req, res) => {
  
  const format = `de`
  const servers = new Intl.NumberFormat(format).format(client.guilds.cache.size)
  const users = new Intl.NumberFormat(format).format(client.guilds.cache.reduce((a, g) => a + g.memberCount, 0))
  const averageUsers = new Intl.NumberFormat(format).format(((client.guilds.cache.reduce((a, g) => a + g.memberCount, 0)) / client.guilds.cache.size).toFixed(0))
  
  const json = {
    servers: servers,
    users: users,
    averageUsers: averageUsers,
  }
  
  res.send(json)
})

app.listen(port, () => {
  console.log(`API launched on port ${port}`)
})