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
    name: "vote",
    description: "Vote for the bot",
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
      .setTitle(`${client.emojis.cache.get(emojis.IconBadgeStaff).toString()}  Vote for ${client.user.username}`)
      .addFields(
        { name: `Vote`, value: `• You can Vote here :), Thanks in advance!` }
      )
      .setTimestamp()
      .setFooter("• Made with heart by Sebi");

    const button = new Discord.MessageButton()
      .setLabel("Top.gg")
      .setStyle("LINK")
      .setURL(`https://top.gg/bot/${client.user.id}/vote`)

    const row = new Discord.MessageActionRow().addComponents(button);

    interaction.reply({embeds: [embed], components: [row]})
  },
};