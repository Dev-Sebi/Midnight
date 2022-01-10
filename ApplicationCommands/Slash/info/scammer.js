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
    name: "scammer",
    description: "Mutes, Kicks or Bans a user that is detected as Scammer or bad Actor!",
    type: 1,
    options: [{
        name: "option",
        description: "Mute, Kick or Ban a member if detected as Scammer or bad Actor!",
        type: 3,
        required: true,
        choices: [{
                name: "Mute 60s",
                value: "60s"
            },
            {
                name: "Mute 5min",
                value: "5min"
            },
            {
                name: "Mute 10min",
                value: "10min"
            },
            {
                name: "Mute 1h",
                value: "1h"
            },
            {
                name: "Mute 1d",
                value: "1d"
            },
            {
                name: "Mute 1w",
                value: "1w"
            },
            {
                name: "Kick",
                value: "kick"
            },
            {
                name: "Ban",
                value: "ban"
            },
            {
                name: "Clear Punishment",
                value: "None"
            },
        ]
    }],

    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */

    execute: async (client, interaction, args) => {

        if (!interaction.member.permissions.has("MODERATE_MEMBERS"))
        {
            return interaction.reply(`Sorry, you dont have to permissions to do that (Moderate Members)`)
        }

        const punishment = await interaction.options._hoistedOptions.find(option => option.name.toLocaleLowerCase() === 'option').value

        con.query({
                sql: `UPDATE ${process.env.DB_DATABASEGUILDS} SET action_scammer=? WHERE id=?`,
                timeout: 10000, // 10s
                values: [punishment, interaction.guild.id],
            },
            async function(err, result, fields) {
                if (err) throw err;
                if (Object.values(result).punishment == 0) {
                    return await interaction.reply(`${client.emojis.cache.get(emojis.Bot_Emergency).toString()} An Error Accured!, please contact https://discord.gg/zbeg7vrkvN \n` + "ErrorCode: `AKJHEdkawndkjAHDklaIdha28eh2pohq2h`")
                } else {
                    const tmp = function() {
                        if (punishment.includes("ban") || punishment.includes("kick"))
                        {
                            return punishment
                        }
                        else if (punishment != "None")
                        {
                            return punishment + " Timeout"
                        }
                        else
                        {
                            return "None"
                        }

                    }
                    let text = `Set ${tmp()} as Punishment for every member that was detected to be a Scammer or bad actor!`
                    if (punishment == "None")
                    {
                        text = `Removed Punishment for every member that is detected as Scammer or bad actor!`
                    }
                    await interaction.reply({content: `${client.emojis.cache.get(emojis.Bot_Tick).toString()} ${text}`, ephemeral: true })

                    con.query({
                            sql: `SELECT * FROM ${process.env.DB_DATABASEGUILDS} WHERE id=?`,
                            timeout: 10000, // 10s
                            values: [interaction.guild.id],
                        },
                        async function(err, result, fields) {
                            if (err) throw err;
                            if (Object.values(result).punishment == 0)
                            {
                                return await interaction.reply(`${client.emojis.cache.get(emojis.Bot_Emergency).toString()} An Error Accured!, please contact https://discord.gg/zbeg7vrkvN \n` + "ErrorCode: `kjuaWZGDjkAWHdkljaWHdioawHodi783q2z32`")
                            }
                            else
                            {
                                if (result[0].logchannel != '')
                                {
                                    const channel = await interaction.guild.channels.cache.find(ch => ch.id === result[0].logchannel)
                                    const embed = new Discord.MessageEmbed()
                                        .setColor(colors.Blurple)
                                        .setDescription(`${client.emojis.cache.get(emojis.IconMod).toString()} ${interaction.member} Updated the automatic Punishment for Scammers or bad actors to ${"`" + tmp() + "`"}`)
                                        .setTimestamp()
                                    await channel?.send({embeds: [embed]}).catch((err) => {});
                                }
                            }
                        })
                }
            })
    },
};