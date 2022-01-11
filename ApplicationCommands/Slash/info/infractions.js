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
    name: "infractions",
    description: "Shows how many links were detected by the specified user",
    type: 1,
    options: [
        {
            name: "user",
            type: 6,description: "The User you want to see the infractions from",
            required: true,
        },
    ],

    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    
    execute: async (client, interaction, args) => {
        
        const userid = await interaction.options._hoistedOptions[0].user.id
        const user = await interaction.guild.members.fetch(userid).catch( (error) => {
            console.log(error)
            return interaction.reply(`${client.emojis.cache.get(emojis.Bot_Emergency).toString()} Something went wrong, please try again!`)
        })
        con.query(
            {
              sql: `SELECT * FROM ${process.env.DB_DATABASENAME} WHERE id=?`,
              timeout: 10000, // 10s
              values: [userid],
            },
            async function (err, result, fields) {
                if (err) throw err;
                if (Object.values(result).length == 0)
                {
                    const embed = new Discord.MessageEmbed()
                        .setColor(colors.Green)
                        .setDescription(`${client.emojis.cache.get(emojis.IconBadgeStaff).toString()} ${user.user.username} has **0** global infractions and is ${result[0].flag_scammer === "true" ? "" : "not "} marked as a Scammer!`)

                    return interaction.reply({embeds: [embed]})
                }
                else
                {
                    const embed = new Discord.MessageEmbed()
                        .setColor(colors.Blurple)
                        .setDescription(`${client.emojis.cache.get(emojis.IconBadgeStaff).toString()} ${user.user.username} has **${result[0].infractions}** global infractions`)

                    return interaction.reply({embeds: [embed]})
                }
            }
        )
    },
};