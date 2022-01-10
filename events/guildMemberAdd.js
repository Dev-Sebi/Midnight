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
                    else
                    {
                        try
                        {
                            const channel = await member.guild.channels.cache.find(ch => ch.id === result[0].logchannel)

                            const embed = new Discord.MessageEmbed()
                                .setColor(colors.Red)
                                .setDescription(`${client.emojis.cache.get(emojis.IconMod).toString()} :warning: <@${member.id}> (ID: ${member.id}) Is a Potential Scammer or Bad Actor! \n\n` + "Reason:\n" + "`Was found to be active in a server that provides Discord Token Grabber (Discord Account Stealer) Malware!`")
                                .setTimestamp()
                            await channel.send({ embeds: [embed]}).catch((err) => { console.log (err) });

                            const action = result[0].action_scammer

                            if(action === "60s")
                            {
                                await member.timeout(60 * 1000, 'Midnight Auto Moderation - Phish Link or Scammer Detected').then(channel.send({ embeds: [timeembed]})).catch((err) => {
                                    const embed = new Discord.MessageEmbed()
                                        .setColor(colors.Red)
                                        .setDescription(`${client.emojis.cache.get(emojis.IconMod).toString()} I wasn't able to timeout ${message.author}! Please Check my Permissions!`)
                                        .setTimestamp()
                                    return channel?.send({ embeds: [embed]}).catch((err) => {});
                                })
                            }
                            else if(action == "5min")
                            {
                                await member.timeout(5 * 60 * 1000, 'Midnight Auto Moderation - Phish Link or Scammer Detected').then(channel.send({ embeds: [timeembed]})).catch((err) => {
                                    const embed = new Discord.MessageEmbed()
                                        .setColor(colors.Red)
                                        .setDescription(`${client.emojis.cache.get(emojis.IconMod).toString()} I wasn't able to timeout ${message.author}! Please Check my Permissions!`)
                                        .setTimestamp()
                                    return channel?.send({ embeds: [embed]}).catch((err) => {});
                                })
                            }
                            else if(action == "10min")
                            {
                                await member.timeout(10 * 60 * 1000, 'Midnight Auto Moderation - Phish Link or Scammer Detected').then(channel.send({ embeds: [timeembed]})).catch((err) => {
                                    const embed = new Discord.MessageEmbed()
                                        .setColor(colors.Red)
                                        .setDescription(`${client.emojis.cache.get(emojis.IconMod).toString()} I wasn't able to timeout ${message.author}! Please Check my Permissions!`)
                                        .setTimestamp()
                                    return channel?.send({ embeds: [embed]}).catch((err) => {});
                                })
                            }
                            else if(action == "1h")
                            {
                                await member.timeout(60 * 60 * 1000, 'Midnight Auto Moderation - Phish Link or Scammer Detected').then(channel.send({ embeds: [timeembed]})).catch((err) => {
                                    const embed = new Discord.MessageEmbed()
                                        .setColor(colors.Red)
                                        .setDescription(`${client.emojis.cache.get(emojis.IconMod).toString()} I wasn't able to timeout ${message.author}! Please Check my Permissions!`)
                                        .setTimestamp()
                                    return channel?.send({ embeds: [embed]}).catch((err) => {});
                                })
                            }
                            else if(action == "1d")
                            {
                                await member.timeout(60 * 60 * 1000 * 24, 'Midnight Auto Moderation - Phish Link or Scammer Detected').then(channel.send({ embeds: [timeembed]})).catch((err) => {
                                    const embed = new Discord.MessageEmbed()
                                        .setColor(colors.Red)
                                        .setDescription(`${client.emojis.cache.get(emojis.IconMod).toString()} I wasn't able to timeout ${message.author}! Please Check my Permissions!`)
                                        .setTimestamp()
                                    return channel?.send({ embeds: [embed]}).catch((err) => {});
                                })
                            }
                            else if(action == "1w")
                            {
                                await member.timeout(60 * 60 * 1000 * 24 * 7, 'Midnight Auto Moderation - Phish Link or Scammer Detected').then(channel.send({ embeds: [timeembed]})).catch((err) => {
                                    const embed = new Discord.MessageEmbed()
                                        .setColor(colors.Red)
                                        .setDescription(`${client.emojis.cache.get(emojis.IconMod).toString()} I wasn't able to timeout ${message.author}! Please Check my Permissions!`)
                                        .setTimestamp()
                                    return channel?.send({ embeds: [embed]}).catch((err) => {});
                                })
                            }
                            else if(action == "kick")
                            {
                                await member.kick({reason: 'Midnight Auto Moderation - Phish Link or Scammer Detected' }).catch((err) => { 
                                    try
                                    {
                                        const embed = new Discord.MessageEmbed()
                                            .setColor(colors.Red)
                                            .setDescription(`${client.emojis.cache.get(emojis.IconMod).toString()} I wasn't able to kick ${message.author}! Please Check my Permissions!`)
                                            .setTimestamp()
                                        return channel?.send({ embeds: [embed]}).catch((err) => {});
                                    }
                                    catch(err)
                                    {
                                        console.log(err)
                                        //Nothing
                                    }
                                })
                            }
                            else if(action == "ban")
                            {
                                await member.ban({reason: 'Midnight Auto Moderation - Phish Link or Scammer Detected' }).catch((err) => {
                                    try
                                    {
                                        const embed = new Discord.MessageEmbed()
                                            .setColor(colors.Red)
                                            .setDescription(`${client.emojis.cache.get(emojis.IconMod).toString()} I wasn't able to ban ${message.author}! Please Check my Permissions!`)
                                            .setTimestamp()
                                        return channel?.send({ embeds: [embed]}).catch((err) => {});
                                    }
                                    catch(err)
                                    {
                                        console.log(err)
                                        //Nothing
                                    }
                                })
                            }
                        }
                        catch(err)
                        {
                            // nothing
                        }
                    }
                })
            }
            else
            {
                // nothing
            }
        })

})