require("dotenv").config();
const Discord = require("discord.js");
const client = require("../bot.js");
const con = require("../database/connection");
const colors = require("../utils/colors.js");
const emojis = require("../utils/emojis.js");
const { glob } = require("glob");
const { promisify } = require("util");


client.on("guildMemberAdd", async (member) => {

    con.query(
        {
          sql: `SELECT * FROM ${process.env.DB_DATABASENAME} WHERE id=?`,
          timeout: 10000, // 10s
          values: [member.id],
        },
        async function (err, result, fields) {
            if (err) throw err;
            if (Object.values(result).length == 0)
            {
                // nothing
            }
            else if(result[0].flag_scammer === "true")
            {
                const flag_scammer = result[0].flag_scammer
                con.query(
                {
                  sql: `SELECT * FROM ${process.env.DB_DATABASEGUILDS} WHERE id=?`,
                  timeout: 10000, // 10s
                  values: [member.guild.id],
                },
                async function (err, result, fields) {
                    if (err) throw err;
                    if (Object.values(result).length == 0)
                    {
                        // nothing
                    }
                    else if(flag_scammer === "true")
                    {
                        try
                        {
                            const guild = await client.guilds.cache.find(g => g.id === "850690156582273054") // Bot Testing Server
                            const logging = await guild.channels.cache.find(ch => ch.id === "927205569004191784") // Bot Logging Channel
                            const channel = await member.guild.channels.cache.find(ch => ch.id === result[0].logchannel)

                            const embed = new Discord.MessageEmbed()
                                .setColor(colors.Red)
                                .setDescription(`<@${member.id}> (${member.id}) joined ${member.guild}!`)
                                .setTimestamp()
                            logging.send({ embeds: [embed]});

                            const embed1 = new Discord.MessageEmbed()
                                .setColor(colors.Red)
                                .setDescription(`${client.emojis.cache.get(emojis.IconMod).toString()} :warning: <@${member.id}> (${member.id}) Is a Potential Scammer or Bad Actor!`)
                                .setTimestamp()
                            return channel.send({ embeds: [embed1]}).catch((err) => { console.log (err) });
                        }
                        catch(err)
                        {
                            console.log(err)
                            // nothing
                        }
                    }
                    else
                    {
                        // nothing
                    }
                })
            }
            else
            {
                // nothing
            }
        })

})