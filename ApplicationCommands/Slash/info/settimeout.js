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
    name: "settimeout",
    description: "Mutes a user that sends a detected Phish link!",
    type: 1,
    options: [
        {
            name: "mute",
            description: "Mute a member if a Phish link is sent",
            type: 3,
            required: true,
            choices: [
                {
                    name: "60s",
                    value: "60s"
                },
                {
                    name: "5min",
                    value: "5min"
                },
                {
                    name: "10min",
                    value: "10min"
                },
                {
                    name: "1h",
                    value: "1h"
                },
                {
                    name: "1d",
                    value: "1d"
                },
                {
                    name: "1w",
                    value: "1w"
                },
                {
                    name: "Remove Mute",
                    value: "None"
                },
            ]
        }
    ],

    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    
    execute: async (client, interaction, args) => {
        
        if(!interaction.member.permissions.has("MUTE_MEMBERS"))
        {
            interaction.reply(`Sorry, you dont have to permissions to do that (Mute Members)`)
            return;
        }

        const length = await interaction.options._hoistedOptions.find(option => option.name.toLocaleLowerCase() === 'mute').value

        con.query(
        {
        sql: `UPDATE ${process.env.DB_DATABASEGUILDS} SET punishment=? WHERE id=?`,
        timeout: 10000, // 10s
        values: [length, interaction.guild.id],
        },
        async function (err, result, fields) {
            if (err) throw err;
            if (Object.values(result).length == 0)
            {
                return await interaction.reply(`${client.emojis.cache.get(emojis.Bot_Emergency).toString()} An Error Accured!, please contact https://discord.gg/zbeg7vrkvN \n` + "ErrorCode: `AJKWHZdgiJAWgdukAWGdiuAWd78i9qwAd8`")
            }
            else
            {
                let text = `Set ${length} as Timeout for every member that has sent a Phishing link`
                if(length == "None")
                {
                    text = `Removed Timeout for every member that has sent a Phishing link`
                }
                await interaction.reply({content: `${client.emojis.cache.get(emojis.Bot_Tick).toString()} ${text}`, ephemeral: true})
                
                con.query(
                {
                  sql: `SELECT * FROM ${process.env.DB_DATABASEGUILDS} WHERE id=?`,
                  timeout: 10000, // 10s
                  values: [interaction.guild.id],
                },
                async function (err, result, fields) {
                    if (err) throw err;
                    if (Object.values(result).length == 0)
                    {
                        return await interaction.reply(`${client.emojis.cache.get(emojis.Bot_Emergency).toString()} An Error Accured!, please contact https://discord.gg/zbeg7vrkvN \n` + "ErrorCode: `kjuaWZGDjkAWHdkljaWHdioawHodi783q2z32`")
                    }
                    else
                    {
                        if(result[0].logchannel != '')
                        {
                            const channel = await interaction.guild.channels.cache.find(ch => ch.id === result[0].logchannel)
                            const embed = new Discord.MessageEmbed()
                                .setColor(colors.Blurple)
                                .setDescription(`${client.emojis.cache.get(emojis.IconMod).toString()} ${interaction.member} Updated the automatic Timeout to ${"`" + length + "`"}`)
                                .setTimestamp()
                            await channel?.send({ embeds: [embed]}).catch((err) => { });
                        }
                    }
                })
            }
        })
    },
};