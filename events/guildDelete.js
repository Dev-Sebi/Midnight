require("dotenv").config();
const Discord = require("discord.js");
const client = require("../bot.js");
const con = require("../database/connection");
const { AutoPoster } = require('topgg-autoposter')
const Topgg = require(`@top-gg/sdk`)
const colors = require("../utils/colors");
const api = new Topgg.Api(process.env.TOPGGTOKEN)
const ap = AutoPoster(process.env.TOPGGTOKEN, client)
const { glob } = require("glob");
const { promisify } = require("util");


client.on("guildDelete", async guild => {
    if(!guild) return;
    try
    {  
      con.query(
        {
            sql: `DELETE FROM ${process.env.DB_DATABASEGUILDS} WHERE id=?`,
            timeout: 10000, // 10s
            values: [guild.id],
        },
          async function (err) {
            if (err) throw err;
          }
        );
        console.log(`Left ${guild.name} [Members:${guild.memberCount}] (${client.user.username} is now in ${client.guilds.cache.size} Servers!)`)
    }
    catch(error)
    {
        console.log("Error in /events/guildDelete.js")
    }
  })