require("dotenv").config();
const { glob } = require("glob");
const { promisify } = require("util");
const { Client } = require("discord.js");
const globPromise = promisify(glob);

/**
 * @param {Client} client
 */

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
        const users = new Intl.NumberFormat(format).format(client.guilds.cache.reduce((a, g) => a + g.memberCount, 0))
        client.user.setActivity(`${users} Users`, { type: "WATCHING" }); 
        setInterval(async() => {
            client.user.setActivity(`${users} Users`, { type: "WATCHING" }); 
        }, 3600000) // 1 hour
    });
};
};