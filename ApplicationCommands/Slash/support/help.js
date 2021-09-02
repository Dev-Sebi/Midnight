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
    name: "help",
    description: "Need some Help?",
    type: 1,

    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    
    execute: async (client, interaction, args) => {

        const embed = new Discord.MessageEmbed()
            .setColor(colors.Blurple)
            .setTitle(`${client.emojis.cache.get(emojis.IconApplicationPending).toString()} What is ${client.user.username}?`)
            .addField('**How does it work?**', `• ${client.user.username} is actively looking out for scamlinks and once detected, immediately deletes them, leaving your server behind secured and safe`, true)
            .addField('**FAQ**', `• Does this bot have a Prefix?\n*No!, we completely use Slash commands!*`, false)
            .setTimestamp()
            .setFooter("• Made with heart by Sebi");

          let button = new Discord.MessageButton()
            .setLabel("Invite me!")
            .setStyle("LINK")
            .setURL(`https://discord.com/oauth2/authorize?client_id=${client.user.id}&permissions=19327428608&scope=bot%20applications.commands`)
            .setEmoji(emojis.IconJoin);

          let button2 = new Discord.MessageButton()
            .setLabel("Join the Support Server")
            .setStyle("LINK")
            .setURL(`https://discord.gg/dUyBRSwRnC`)
            .setEmoji(emojis.IconShield);

          let row = new Discord.MessageActionRow().addComponents(button, button2);

          await interaction.followUp({embeds: [embed], components: [row]}).catch((error) => {
            console.log(error)
            return;
          })      
    },
};