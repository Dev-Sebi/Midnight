require("dotenv").config();
const Discord = require("discord.js");
const client = require("../bot.js");
const con = require("../database/connection");
const { AutoPoster } = require('topgg-autoposter')
const Topgg = require(`@top-gg/sdk`)
const emojis = require("../utils/emojis.js");
const colors = require("../utils/colors");
const api = new Topgg.Api(process.env.TOPGGTOKEN)
const ap = AutoPoster(process.env.TOPGGTOKEN, client)
const { glob } = require("glob");
const { promisify } = require("util");
const badwords = require("../utils/badwords")

client.on("guildCreate", async guild => {
  console.log(`Joined ${guild.name} [Members:${guild.memberCount}] (${client.user.username} is now in ${client.guilds.cache.size} Servers!)`)
})