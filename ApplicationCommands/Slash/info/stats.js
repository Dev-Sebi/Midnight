require("dotenv").config();
const { Client, CommandInteraction } = require("discord.js");
const Discord = require("discord.js");
const fetch = require('node-fetch');
const emojis = require("../../../utils/emojis");
const colors = require("../../../utils/colors");
const con = require("../../../database/connection");
const wait = require('util').promisify(setTimeout);
const moment = require('moment');

module.exports = {
    name: "stats",
    description: "Get the Stats of the Bot",
    type: 1,

    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    
    execute: async (client, interaction, args) => {

        let totalSeconds = (client.uptime / 1000);
        let days = Math.floor(totalSeconds / 86400);
        totalSeconds %= 86400;
        let hours = Math.floor(totalSeconds / 3600);
        totalSeconds %= 3600;
        let minutes = Math.floor(totalSeconds / 60);
        let seconds = Math.floor(totalSeconds % 60);

        const format = `de`
        const servers = new Intl.NumberFormat(format).format(client.guilds.cache.size)
        const users = new Intl.NumberFormat(format).format(client.guilds.cache.reduce((a, g) => a + g.memberCount, 0))
        const averageUsers = new Intl.NumberFormat(format).format(((client.guilds.cache.reduce((a, g) => a + g.memberCount, 0)) / client.guilds.cache.size).toFixed(0))
        
        const embed = new Discord.MessageEmbed()
            .setTitle(`${client.emojis.cache.get(emojis.IconMod).toString()} Information about ${client.user.username}`)
            .setColor(colors.Blurple)
            .addFields(
                { name: "Servers:", value: "```" + servers + "```", inline: true },
                { name: "Users:", value:  "```" + users + "```", inline: true },
                { name: "Average Users per Server:", value:  "```" + averageUsers + "```", inline: true },
                { name: "Uptime:", value:  "```" + `${days} days, ${hours} hours, ${minutes} minutes and ${seconds} seconds` + "```", inline: true },
            )
            .setTimestamp()
            .setFooter("• Made with heart by Sebi");
        interaction.reply({ embeds: [embed]});
        return;
    },
};