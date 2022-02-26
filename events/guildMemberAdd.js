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
                        const channel = await member.guild.channels.cache.find(ch => ch.id === result[0].logchannel)
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
                            }).then(userdm.send(`You have been **kicked** from **${guild.name}** for beeing detected as Scam account!`))
                            return;
                        }

                        else if(action === "ban")
                        {
                            await member.kick({reason: 'Midnight Auto Moderation - Phish Link or Scammer Detected' }).then(channel?.send({ embeds: [badActorSetupBan] })).catch((err) => { 
                                return channel?.send({ embeds: [noPermissions]}).catch((err) => {});
                            }).then(userdm.send(`You have been **banned** from **${guild.name}** for beeing detected as Scam account!`))
                            return;
                        }
                    }
                }
            )
        })
})