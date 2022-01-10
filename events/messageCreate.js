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
    if (!message.guild.me.permissions.has('MANAGE_MESSAGES')) return;
    
    // message all in lowercase
    const messagectn = message.content.toLowerCase()
    const member = message.member
    const regex = /(https?:\/\/[^\s]+)/g;
    const links = messagectn.match(regex)
    const guild = await client.guilds.cache.find(g => g.id === "850690156582273054") // Bot Testing Server
    const logging = await guild.channels.cache.find(ch => ch.id === "925655493416988674") // Bot Logging Channel
    const protected = ["www.reddit.com", "dankmemer.lol", "help.minecraft.net", "www.instagram.com", "clips.twitch.tv", "open.spotify.com", "twitter.com", "www.twitch.tv", "discord.com", "discord.gg", "media.discordapp.net", "cdn.discord.com", "cdn.discordapp.com", "tenor.com", "github.com", "www.youtube.com", "youtu.be"]

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
                                scammer = result[0].flag_scammer
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
                                        const channel = await message.guild.channels.cache.find(ch => ch.id === result[0].logchannel)
                                        const timeembed = new Discord.MessageEmbed()
                                            .setColor(colors.Red)
                                            .setDescription(`${client.emojis.cache.get(emojis.IconMod).toString()} ${message.author} posted one or more malicious links! \n\n ||${links.toString().replace(",", "\n")}||`)
                                            .setFooter(`Timeouted them for ${tmout()}!`)
                                            .setTimestamp()
                                        if(tmout() == "60s")
                                        {
                                            await member.timeout(60 * 1000, 'Midnight Auto Moderation - Phish Link or Scammer Detected').then(channel.send({ embeds: [timeembed]})).catch((err) => {
                                                const embed = new Discord.MessageEmbed()
                                                    .setColor(colors.Red)
                                                    .setDescription(`${client.emojis.cache.get(emojis.IconMod).toString()} I wasn't able to timeout ${message.author}! Please Check my Permissions!`)
                                                    .setTimestamp()
                                                return channel?.send({ embeds: [embed]}).catch((err) => {});
                                             })
                                        }
            
                                        else if(tmout() == "5min")
                                        {
                                            await member.timeout(5 * 60 * 1000, 'Midnight Auto Moderation - Phish Link or Scammer Detected').then(channel.send({ embeds: [timeembed]})).catch((err) => {
                                                const embed = new Discord.MessageEmbed()
                                                    .setColor(colors.Red)
                                                    .setDescription(`${client.emojis.cache.get(emojis.IconMod).toString()} I wasn't able to timeout ${message.author}! Please Check my Permissions!`)
                                                    .setTimestamp()
                                                return channel?.send({ embeds: [embed]}).catch((err) => {});
                                            })
                                        }
            
                                        else if(tmout() == "10min")
                                        {
                                            await member.timeout(10 * 60 * 1000, 'Midnight Auto Moderation - Phish Link or Scammer Detected').then(channel.send({ embeds: [timeembed]})).catch((err) => {
                                                const embed = new Discord.MessageEmbed()
                                                    .setColor(colors.Red)
                                                    .setDescription(`${client.emojis.cache.get(emojis.IconMod).toString()} I wasn't able to timeout ${message.author}! Please Check my Permissions!`)
                                                    .setTimestamp()
                                                return channel?.send({ embeds: [embed]}).catch((err) => {});
                                            })
                                        }
            
                                        else if(tmout() == "1h")
                                        {
                                            await member.timeout(60 * 60 * 1000, 'Midnight Auto Moderation - Phish Link or Scammer Detected').then(channel.send({ embeds: [timeembed]})).catch((err) => {
                                                const embed = new Discord.MessageEmbed()
                                                    .setColor(colors.Red)
                                                    .setDescription(`${client.emojis.cache.get(emojis.IconMod).toString()} I wasn't able to timeout ${message.author}! Please Check my Permissions!`)
                                                    .setTimestamp()
                                                return channel?.send({ embeds: [embed]}).catch((err) => {});
                                            })
                                        }
            
                                        else if(tmout() == "1d")
                                        {
                                            await member.timeout(60 * 60 * 1000 * 24, 'Midnight Auto Moderation - Phish Link or Scammer Detected').then(channel.send({ embeds: [timeembed]})).catch((err) => {
                                                const embed = new Discord.MessageEmbed()
                                                    .setColor(colors.Red)
                                                    .setDescription(`${client.emojis.cache.get(emojis.IconMod).toString()} I wasn't able to timeout ${message.author}! Please Check my Permissions!`)
                                                    .setTimestamp()
                                                return channel?.send({ embeds: [embed]}).catch((err) => {});
                                            })
                                        }
            
                                        else if(tmout() == "1w")
                                        {
                                            await member.timeout(60 * 60 * 1000 * 24 * 7, 'Midnight Auto Moderation - Phish Link or Scammer Detected').then(channel.send({ embeds: [timeembed]})).catch((err) => {
                                                const embed = new Discord.MessageEmbed()
                                                    .setColor(colors.Red)
                                                    .setDescription(`${client.emojis.cache.get(emojis.IconMod).toString()} I wasn't able to timeout ${message.author}! Please Check my Permissions!`)
                                                    .setTimestamp()
                                                return channel?.send({ embeds: [embed]}).catch((err) => {});
                                            })
                                            
                                        }
                                        else if(tmout() == "kick")
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
                                        else if(tmout() == "ban")
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
                                        await message.delete().catch((err) => { 
                                            const embed = new Discord.MessageEmbed()
                                                .setColor(colors.Red)
                                                .setDescription(`${client.emojis.cache.get(emojis.IconMod).toString()} I wasn't able to take actions againt ${message.author}'s message(s)!`)
                                                .setTimestamp()
                                            return channel?.send({ embeds: [embed]}).catch((err) => {});
                                        })
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