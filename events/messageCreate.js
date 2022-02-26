require("dotenv").config();
const Discord = require("discord.js");
const client = require("../bot.js");
const con = require("../database/connection");
const emojis = require("../utils/emojis.js");
const colors = require("../utils/colors.js");
const { glob } = require("glob");
const { promisify } = require("util");
const axios = require('axios');
const wait = require('util').promisify(setTimeout);

var url = process.env.PhishLink;

client.on("messageCreate", async (message) => {

    if(message.system) return;
   
    
    // message all in lowercase
    const messagectn = message.content.toLowerCase()
    const member = message.member
    const regex = /(https?:\/\/[^\s]+)/g;
    const links = messagectn.match(regex)
    const guild = await client.guilds.cache.find(g => g.id === "850690156582273054") // Bot Testing Server
    const logging = await guild.channels.cache.find(ch => ch.id === "925655493416988674") // Bot Logging Channel
    const protected = ["www.reddit.com", "dankmemer.lol", "help.minecraft.net", "www.instagram.com", "clips.twitch.tv", "open.spotify.com", "twitter.com", "www.twitch.tv", "discord.com", "discord.gg", "media.discordapp.net", "cdn.discord.com", "cdn.discordapp.com", "tenor.com", "github.com", "youtube.com", "youtu.be"]

    if(!links) return;
    links.forEach(hit => {
        hit = hit.replace(/(^\w+:|^)\/\//, '').split('/')[0].toLowerCase();
        if(protected.includes(hit)) return;
        axios.get(`${url}/${hit}`, {
            headers: {
                "X-Identity": process.env.PhishIdendity,
            }
           })
            .then(response => {
                let scam = response.data
                const embed = new Discord.MessageEmbed()
                    .setColor(scam ? colors.Red : colors.Green)
                    .setDescription(`
                    Link: ${"`" + hit + "`"}
                    Scam: ${"`" + scam + "`"}\n
                    `)
                    .setFooter(`Sent from: ${message.guild.name} (ID: ${message.guild.id})`)
                    .setTimestamp()
                logging.send({ embeds: [embed]});
                if(!scam)
                {
                    return;
                    //nothing, search for other links
                }
                else
                {
                    const userdm = message.author
                    const dmPhishingWarning = new Discord.MessageEmbed()
                        .setColor(colors.Red)
                        .setDescription(`${client.emojis.cache.get(emojis.IconMod).toString()} Please do not post any Phising links in <#${message.channel.id}>!\n Links Detected: ` + "`" + links + "`" + `\n\n :warning: if this wasn't you, we advise you to change your Password immediately! Someone might have Access to your Account!`)
                        .setTimestamp()
                    
                    message.delete();
                    userdm.send({ embeds: [dmPhishingWarning]}).catch((err) => {});

                    let scammer
                    con.query(
                        {
                          sql: `SELECT * FROM ${process.env.DB_DATABASENAME} WHERE id=?`,
                          timeout: 10000, // 10s
                          values: [message.author.id],
                        },
                        async function (err, result, fields) {
                            if (err) throw err;
                            if (Object.values(result).length == 0)
                            {
                                con.query(
                                    {
                                        sql: `INSERT INTO ${process.env.DB_DATABASENAME} (id, infractions) VALUES (?, ?)`,
                                        timeout: 10000, // 10s
                                        values: [message.author.id, 1],
                                    },
                                      async function (err) {
                                        if (err) throw err;
                                    })
                            }
                            else 
                            {
                                let infractions = result[0].infractions + 1
                                con.query(
                                    {
                                        sql: `UPDATE ${process.env.DB_DATABASENAME} SET infractions=? WHERE id=?`,
                                        timeout: 10000, // 10s
                                        values: [infractions, message.author.id],
                                    },
                                    async function (err) {
                                        if (err) throw err;
                                });
                            }
                            scammer = result[0].flag_scammer || "false"

                            con.query(
                                {
                                  sql: `SELECT * FROM ${process.env.DB_DATABASEGUILDS} WHERE id=?`,
                                  timeout: 10000, // 10s
                                  values: [message.guild.id],
                                },
                                async function (err, result, fields) {
                                    if (err) throw err;
                                    if (Object.values(result).length == 0)
                                    {
                                        return;
                                    }
                                    else
                                    {
                                        const tmout = function(){
                                            if(result[0].action_scammer !== "None" && scammer === "true")
                                            {
                                                return result[0].action_scammer
                                            }
                                            else
                                            {
                                                return result[0].punishment
                                            }
                                        }

                                        let timeout = 0;
                                        const channel = message.guild.channels.cache.find(ch => ch.id === result[0].logchannel)
                                        const timeembed = new Discord.MessageEmbed()
                                            .setColor(colors.Red)
                                            .setDescription(`${client.emojis.cache.get(emojis.IconMod).toString()} ${message.author} posted one or more malicious links! \n\n ||${links.toString().replace(",", "\n")}||`)
                                            .setFooter(`Timeouted them for ${tmout()}!`)
                                            .setTimestamp()

                                        const failTimeout = new Discord.MessageEmbed()
                                            .setColor(colors.Red)
                                            .setDescription(`${client.emojis.cache.get(emojis.IconMod).toString()} I wasn't able to timeout ${message.author}! Please Check my Permissions!`)
                                            .setTimestamp()

                                        const failAction = new Discord.MessageEmbed()
                                            .setColor(colors.Red)
                                            .setDescription(`${client.emojis.cache.get(emojis.IconMod).toString()} I wasn't able to take action against ${message.author}! Please Check my Permissions!`)
                                            .setTimestamp()

                                        if(tmout() === "60s") { timeout = 60 * 1000 }
                                        else if(tmout() === "5min") { timeout = 5 * 60 * 1000 }
                                        else if(tmout() === "10min") { timeout =  10 * 60 * 1000}
                                        else if(tmout() === "1h") { timeout =  60 * 60 * 1000}
                                        else if(tmout() === "1d") { timeout =  60 * 60 * 1000 * 24}
                                        else if(tmout() === "1w") { timeout = 60 * 60 * 1000 * 24 * 7 }
                                        else if(tmout() === "kick") { timeout = "kick" }
                                        else if(tmout() === "ban") { timeout = "ban" }


                                        if(typeof timeout === "number")
                                        {
                                            await member.timeout(timeout, 'Midnight Auto Moderation - Phish Link or Scammer Detected').catch(err => {
                                                return channel?.send({ embeds: [failTimeout]}).catch((err) => {});
                                            })
                                            channel.send({ embeds: [timeembed]}).catch((err) => {
                                                return channel?.send({ embeds: [failTimeout]}).catch((err) => {});
                                            })
                                            userdm?.send(`You have been **Timeouted for ${tmout()}** in **${message.guild.name}** for sending a Phishing Link`)
                                        }

                                        else if(timeout === "kick")
                                        {
                                            await member.kick({reason: 'Midnight Auto Moderation - Phish Link or Scammer Detected' }).catch((err) => { 
                                                    return channel?.send({ embeds: [failAction]}).catch((err) => {});
                                            })
                                            await userdm?.send(`You have been **Kicked** in **${message.guild.name}** for sending a Phishing Link!`)
                                        }

                                        else if(timeout === "ban")
                                        {
                                            await member.ban({reason: 'Midnight Auto Moderation - Phish Link or Scammer Detected' }).catch((err) => { 
                                                    return channel?.send({ embeds: [failAction]}).catch((err) => {});
                                            })
                                            await userdm?.send(`You have been **Banned** in **${message.guild.name}** for sending a Phishing Link!`)
                                        }
                                    }
                                })
                        })
                }
            })
            .catch(error => {
                //nothing
            });
    });
});