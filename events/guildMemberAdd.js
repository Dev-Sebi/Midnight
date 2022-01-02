require("dotenv").config();
const Discord = require("discord.js");
const client = require("../bot.js");
const con = require("../database/connection");
const colors = require("../utils/colors.js");
const emojis = require("../utils/emojis.js");
const { glob } = require("glob");
const { promisify } = require("util");


client.on("guildMemberAdd", async (member) => {

    const guild = await client.guilds.cache.find(g => g.id === "850690156582273054") // Bot Testing Server
    const logging = await guild.channels.cache.find(ch => ch.id === "927205569004191784") // Bot Logging Channel

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
                return;
            }
            else
            {
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
                            return;
                        }
                        else
                        {
                            try
                            {
                                const embed = new Discord.MessageEmbed()
                                    .setColor(colors.Red)
                                    .setDescription(`<@${member.id}> (${member.id}) joined ${member.guild}!`)
                                    .setTimestamp()
                                logging.send({ embeds: [embed]});

                                const channel = await message.guild.channels.cache.find(ch => ch.id === result[0].logchannel)
                                const embed = new Discord.MessageEmbed()
                                    .setColor(colors.Red)
                                    .setDescription(`${client.emojis.cache.get(emojis.IconMod).toString()} :warning: <@${member.id}> (${member.id}) Is a Potential Scammer or Bad Actor!`)
                                    .setTimestamp()
                                return channel?.send({ embeds: [embed]}).catch((err) => {});
                            }
                            catch(err)
                            {
                                console.log(err)
                                //Nothing
                            }
                        }
                    })
            }
        })
})