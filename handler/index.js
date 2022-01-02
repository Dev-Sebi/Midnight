require("dotenv").config();
const { glob } = require("glob");
const { promisify } = require("util");
const { Client } = require("discord.js");
const globPromise = promisify(glob);
const con = require("../database/connection");
const axios = require('axios');

/**
 * @param {Client} client
 */

async function getPotentialScammersID()
{
    const ids = await axios.get(process.env.FroskyLink, {
                        headers: {
                                "Authorization": process.env.FroskyAuth,
                            }
                        })
                        .then(response => {
                            const scamids = response.data.data
                            scamids.forEach(id => {
                                con.query(
                                    {
                                      sql: `INSERT INTO ${process.env.DB_DATABASENAME} (id, flag_scammer) VALUES (?, ?)`,
                                      timeout: 10000, // 10s
                                      values: [id, "true"],
                                    },
                                    async function (err, result, fields) {
                                        if (err) throw err;
                                        if (Object.values(result).length == 0)
                                        {
                                            return console.log(`Unable to add ${id} to DB!`);
                                        }
                                    })
                            });
                        })
}

module.exports = async (client) => {

    const eventFiles = await globPromise(`${process.cwd()}/events/*.js`);
    eventFiles.map((value) => require(value));

    const ApplicationCommands = await globPromise(`${process.cwd()}/ApplicationCommands/*/*/*.js`);

    const ArrayOfApplicationCommands = [];
    ApplicationCommands.map((value) => {
        const file = require(value);
        if (!file?.name) return;
        client.ArrayOfApplicationCommands.set(file.name, file);
        ArrayOfApplicationCommands.push(file);
    });


    client.on("ready", async (client) => {
        console.log(`Logged in as ${client.user.tag}!`);
        console.log(`Currently in ${client.guilds.cache.size} ${client.guilds.cache.size == 1 ? "Server" : "Servers"}`);
        // const f = await client.application.commands.fetch()
        // f.forEach(cmd => cmd.delete())
        // await client.application.commands.set(ArrayOfApplicationCommands); // if you want to update every guild the server is in (up to 1 hour for the update to complete)
        await client.guilds.cache.get("850690156582273054").commands.set(ArrayOfApplicationCommands); // if you want to update only one guild (instant update)
        console.log("Commands Loaded!")

        try 
        {
            client.guilds.cache.forEach(async guild => 
            {
                con.query(
                {
                    sql: `INSERT INTO ${process.env.DB_DATABASEGUILDS} (id) VALUES (?)`,
                    timeout: 10000, // 10s
                    values: [guild.id],
                },
                    async function (err) {
                        if (err) { return };
                        console.log("added " + guild.name)
                    }
                );
            });
        } 
        catch(e)
        {
            //nothing
        }

        const users = new Intl.NumberFormat(`de`).format(client.guilds.cache.reduce((a, g) => a + g.memberCount, 0))
        client.user.setActivity(`${users} Users`, { type: "WATCHING" });
        await getPotentialScammersID()
        setInterval(async() => {
            client.user.setActivity(`${users} Users`, { type: "WATCHING" });
            await getPotentialScammersID()
        }, 3600000) // 1 hour
    });
};