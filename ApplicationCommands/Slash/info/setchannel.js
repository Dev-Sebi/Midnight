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
    name: "setchannel",
    description: "Set a Channel for Moderation logs",
    type: 1,
    options: [
        {
            name: "channel",
            description: "The Channel i will send the logs to",
            type: 7,
            required: true
        },
    ],
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    
    execute: async (client, interaction, args) => {
        
        const id = await interaction.options._hoistedOptions.find(option => option.name.toLocaleLowerCase() === 'channel').value
        const channel = await interaction.guild.channels.cache.find(ch => ch.id === id)

        if(!interaction.member.permissions.has("ADMINISTRATOR"))
        {
            interaction.reply(`Sorry, you dont have to permissions to do that (Administrator)`)
            return;
        }
        
        if(!channel.isText() || channel.isThread())
        {
            const embed = new Discord.MessageEmbed()
                .setColor(colors.Blurple)
                .setTitle(`${client.emojis.cache.get(emojis.Bot_Cross).toString()} Setup ${client.user.username}`)
                .setDescription(`• You cannot use ${channel} as logging channel! \n • please restart the Setup!`)
                .setTimestamp()
            return interaction.reply({embeds: [embed]})
        }

        con.query(
            {
              sql: `UPDATE ${process.env.DB_DATABASEGUILDS} SET logchannel=? WHERE id=?`,
              timeout: 10000, // 10s
              values: [id, interaction.guild.id],
            },
            async function (err, result, fields) {
                if (err) throw err;
                if (Object.values(result).length == 0)
                {
                    await interaction.reply(`${client.emojis.cache.get(emojis.Bot_Emergency).toString()} An Error Accured!, please contact https://discord.gg/zbeg7vrkvN \n` + "ErrorCode: `WDKhAWdho9Adhwahd8haiughd7i6gd`")
                    return
                }
                else
                {
                    const embed = new Discord.MessageEmbed()
                        .setColor(colors.Blurple)
                        .setDescription(`${client.emojis.cache.get(emojis.IconMod).toString()} I'll now send updates to ${channel}!`)
                        .setTimestamp()
                    return interaction.reply({ embeds: [embed]});
                }
            })
    },
};