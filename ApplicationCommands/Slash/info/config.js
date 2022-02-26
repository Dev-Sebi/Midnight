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
    name: "config",
    description: "Shows the Config done to the Server",
    type: 1,

    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    
    execute: async (client, interaction, args) => {
        con.query(
            {
              sql: `SELECT * FROM ${process.env.DB_DATABASEGUILDS} WHERE id=?`,
              timeout: 10000, // 10s
              values: [interaction.guild.id],
            },
            async function (err, result, fields) {
                if (err) throw err;

                const logchannel = await interaction.guild.channels.cache.find(ch => ch.id === result[0].logchannel) || "No Channel!"
                const scammerAction = result[0].action_scammer || "None"
                const punishment = result[0].punishment || "None"
                const embed = new Discord.MessageEmbed()
                    .setTitle(`${client.emojis.cache.get(emojis.IconMod).toString()} Information about ${user.user.username}`)
                    .setColor(colors.Blurple)
                    .addFields(
                        { name: "Logchannel:", value: `${logchannel} (#${logchannel.name})`, inline: true },
                        { name: "Scammer Join:", value:  scammerAction, inline: true },
                        { name: "Punishment on Malicious Links:", value:  punishment, inline: false },
                    )
                    .setTimestamp()
                    .setFooter(`• Made with heart by Sebi`);
                return await interaction.reply({ embeds: [embed]});
            }
        )
    }
}