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
    await axios.get(process.env.FroskyLink, {
        headers: {
                "Authorization": process.env.FroskyAuth,
            }
        })
        .then(response => {
            const all = response.data.data
            all.forEach(user => {
                if(user.bot == 1) return
                con.query(
                    {
                      sql: `INSERT INTO ${process.env.DB_DATABASENAME} (id, flag_scammer, username, discriminator, added, updated, add_reason) VALUES (?, ?, ?, ?, ?, ?, ?)`,
                      timeout: 10000, // 10s
                      values: [user.id, "true", user.username, user.discriminator, user.added, user.updated, user.add_reason],
                    },
                    async function (err, result, fields) {
                        if (err) return;
                        if (Object.values(result).length == 0)
                        {
                            return console.log(`Unable to add ${user.id} to DB!`);
                        }
                        else
                        {
                            return console.log(`Added ${user.username} DB!`);
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
        await client.application.commands.set(ArrayOfApplicationCommands); // if you want to update every guild the server is in (up to 1 hour for the update to complete)
        // await client.guilds.cache.get("850690156582273054").commands.set(ArrayOfApplicationCommands); // if you want to update only one guild (instant update)
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

        client.user.setActivity(`for Scams`, { type: "WATCHING" });
        await getPotentialScammersID()
        setInterval(async() => {
            client.user.setActivity(`for Scams`, { type: "WATCHING" });
            await getPotentialScammersID()
        }, 3600000) // 1 hour
    });
};