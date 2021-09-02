require("dotenv").config();
const Discord = require("discord.js");
const client = require("../bot.js");
const con = require("../database/connection");
const emojis = require("../utils/emojis.js");
const { glob } = require("glob");
const { promisify } = require("util");
const badlinks = require("../utils/badlinks")
const badwords = require("../utils/badwords")

client.on("messageCreate", async (message) => {

    // add database for global users


    for(let i = 0; i <= badlinks.length; i++)
       {
            if(message.content.includes(badlinks[i]))
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
                            console.log("test")
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
                return message.delete();
            }
        }
})