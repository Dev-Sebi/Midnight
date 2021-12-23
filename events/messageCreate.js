require("dotenv").config();
const Discord = require("discord.js");
const client = require("../bot.js");
const con = require("../database/connection");
const emojis = require("../utils/emojis.js");
const colors = require("../utils/colors.js");
const { glob } = require("glob");
const { promisify } = require("util");
const axios = require('axios');

var url = "https://phish.sinking.yachts/v2/check";

client.on("messageCreate", async (message) => {

    if(message.system) return;
    // message all in lowercase
    const messagectn = message.content.toLowerCase()

    let regex = /(https?:\/\/[^\s]+)/g;
    let links = messagectn.match(regex)

    if(!links) return;
    links.forEach(hit => {

        hit = hit.replace(/(^\w+:|^)\/\//, '');
        hit = hit.split('/')[0];
        axios.get(`${url}/${hit}`, {
            headers: {
                "X-Identity": "Sebi - Midnight",
            }
           })
            .then(response => {
                let scam = response.data
                if(!scam)
                {
                    //nothing, search for other links
                }
                else
                {
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
                        })
                    message.delete().catch((err) => {})
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
                                //nothing
                            }
                            else
                            {
                                try
                                {
                                    const channel = await message.guild.channels.cache.find(ch => ch.id === result[0].logchannel)
                                    const embed = new Discord.MessageEmbed()
                                        .setColor(colors.Red)
                                        .setDescription(`${client.emojis.cache.get(emojis.IconMod).toString()} ${message.author} posted one or more malicious links! \n\n ${links.toString().replace(",", "\n")}`)
                                        .setTimestamp()
                                    return channel.send({ embeds: [embed]}).catch((err) => {});
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
            .catch(error => {
                //nothing
            });
    });
});