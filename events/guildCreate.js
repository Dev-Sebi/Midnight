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
  try
  {
    con.query(
      {
        sql: `SELECT * FROM ${process.env.DB_DATABASENAME} WHERE id=?`,
        timeout: 10000, // 10s
        values: [guild.id],
      },
      async function (err, result, fields) {
        if (err) throw err;
        if (Object.values(result).length == 0) {
  
          con.query(
            {
                sql: `INSERT INTO ${process.env.DB_DATABASENAME} (id, verified, partnered, members) VALUES (?, ?, ?, ?)`,
                timeout: 10000, // 10s
                values: [guild.id, guild.verified.toString(), guild.partnered.toString(), guild.memberCount],
            },
              async function (err) {
                if (err) throw err;
              }
            )};
      });
          
  
    console.log(`Joined ${guild.name} [Members:${guild.memberCount}] (Bot is now in ${client.guilds.cache.size} Servers!)`)
  }
  catch(error)
  {
    console.log("Error in /events/guildCreate.js")
  }
})