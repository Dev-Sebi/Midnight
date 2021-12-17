require("dotenv").config();
const Discord = require("discord.js");
const client = require("../bot.js");
const con = require("../database/connection");
const emojis = require("../utils/emojis.js");
const { glob } = require("glob");
const { promisify } = require("util");
const axios = require('axios');

var url = "https://phish.sinking.yachts/v2/check";

client.on("messageCreate", async (message) => {

    // message all in lowercase
    const messagectn = message.content.toLowerCase()

    let regex = /(https?:\/\/[^\s]+)/g;
    let links = messagectn.match(regex)

    if(!links) return;

    links.forEach(hit => {

        hit = hit.replace(/(^\w+:|^)\/\//, '');
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
                    return message.delete()
                }
            })
            .catch(error => {
                //nothing
            });
    });
});