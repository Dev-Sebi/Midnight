require("dotenv").config();
const Discord = require("discord.js");
const client = require("../bot.js");
const con = require("../database/connection");
const colors = require("../utils/colors.js");
const emojis = require("../utils/emojis.js");


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
                return;
                // nothing
            }

            const scammer = result[0].flag_scammer

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
                        // nothing
                    }
                    if(scammer === "false") return;
                    else if(scammer === "true")
                    {
                        let action = ""
                        const channel = member.guild.channels.cache.find(ch => ch.id === result[0].logchannel)
                        const userdm = member

                        const badActorNoSetup = new Discord.MessageEmbed()
                            .setColor(colors.Red)
                            .setDescription(`${client.emojis.cache.get(emojis.IconMod).toString()} :warning: <@${member.id}> (ID: ${member.id}) Is a Potential Scammer or Bad Actor! \n\n` + "Reason:\n" + "`Was found to be active in a server that provides Discord Token Grabber (Discord Account Stealer) Malware!`")
                            .setTimestamp()

                        const badActorSetupKick = new Discord.MessageEmbed()
                            .setColor(colors.Green)
                            .setDescription(`${client.emojis.cache.get(emojis.IconMod).toString()} :warning: <@${member.id}> (ID: ${member.id}) Was Kicked! \n\n` + "Reason:\n" + "`Was found to be active in a server that provides Discord Token Grabber (Discord Account Stealer) Malware!`")
                            .setTimestamp()

                        const badActorSetupBan = new Discord.MessageEmbed()
                            .setColor(colors.Green)
                            .setDescription(`${client.emojis.cache.get(emojis.IconMod).toString()} :warning: <@${member.id}> (ID: ${member.id}) Was Banned! \n\n` + "Reason:\n" + "`Was found to be active in a server that provides Discord Token Grabber (Discord Account Stealer) Malware!`")
                            .setTimestamp()

                        const noPermissions = new Discord.MessageEmbed()
                            .setColor(colors.Red)
                            .setDescription(`${client.emojis.cache.get(emojis.IconMod).toString()} I wasn't able to take action against ${member.user.username}! Please Check my Permissions!`)
                            .setTimestamp()


                        if(result[0].action_scammer === "kick") { action = "kick" }
                        else if(result[0].action_scammer === "ban") { action = "ban" }
                        else { return await channel?.send({ embeds: [badActorNoSetup]}); }


                        if(action === "kick")
                        {
                            await member.kick({reason: 'Midnight Auto Moderation - Phish Link or Scammer Detected' }).then(channel?.send({ embeds: [badActorSetupKick] })).catch((err) => { 
                                return channel?.send({ embeds: [noPermissions]}).catch((err) => {});
                            }).then(userdm.send(`You have been **kicked** from **${member.guild.name}** for being detected as a Scam account!`))
                        }

                        else if(action === "ban")
                        {
                            await member.ban({reason: 'Midnight Auto Moderation - Phish Link or Scammer Detected' }).then(channel?.send({ embeds: [badActorSetupBan] })).catch((err) => { 
                                return channel?.send({ embeds: [noPermissions]}).catch((err) => {});
                            }).then(userdm.send(`You have been **banned** from **${member.guild.name}** for being detected as a Scam account!`))
                        }

                        if(action === "kick" || action === "ban")
                        {
                            con.query(
                                {
                                sql: `SELECT * FROM ${process.env.DB_DATABASEGUILDS} WHERE id = ?`,
                                timeout: 10000, // 10s
                                values: [member.guild.id],
                                },
                                async function (err, result, fields) {
                                    if (err) throw err;
                                    if (Object.values(result).length == 0)
                                    {
                                        return;
                                    }            
                                    const users_punished = (parseInt(result[0].users_punished) + 1).toString()
                                    const users_prevented_from_joining = (parseInt(result[0].users_prevented_from_joining) + 1).toString()
                                    
                                    con.query(
                                        {
                                        sql: `UPDATE ${process.env.DB_DATABASEGUILDS} SET users_punished = ?, users_prevented_from_joining = ? WHERE id = ?`,
                                        timeout: 10000, // 10s
                                        values: [users_punished, users_prevented_from_joining, member.guild.id],
                                        },
                                        async function (err, result, fields) {
                                            if (err) throw err;
                                        }
                                    )
                                }
                            )
                        }
                    }
                }
            )
        })
})