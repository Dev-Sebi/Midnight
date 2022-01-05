require("dotenv").config();
const { Client, CommandInteraction } = require("discord.js");
const Discord = require("discord.js");
const fetch = require('node-fetch');
const emojis = require("../../../utils/emojis");
const colors = require("../../../utils/colors");
const con = require("../../../database/connection");
const wait = require('util').promisify(setTimeout);
const moment = require('moment');
const { emitKeypressEvents } = require("readline");

module.exports = {
    name: "submit-phish",
    description: "Submit a Phishing or other type of Scamming Websites",
    type: 1,
    options: [
        {
            name: "link",
            type: 3,
            description: "The link you want to report!",
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
        
        const link = await (interaction.options._hoistedOptions.find(o => o.name === "link").value.toString().toLowerCase())
        const regex = /(https?:\/\/[^\s]+)/g;
        const guild = await client.guilds.cache.find(g => g.id === "850690156582273054") // Bot Testing Server
        const channel = await guild.channels.cache.find(ch => ch.id === "928415970270249011") // Bot Submit Channel
        const links = link.match(regex)
        if(!links)
        {
            const embed = new Discord.MessageEmbed()
                .setColor(colors.Blurple)
                .setTitle(`${client.emojis.cache.get(emojis.Bot_Cross).toString()} Link Submission canceled!`)
                .setDescription(`• The link(s) you provided are not valid!\n•be sure to paste the complete link!`)
                .setTimestamp()
            return await interaction.reply({embeds: [embed]})
        }
        else
        {
            try
            {
                let i = "";
                links.forEach(link => {
                    if(link != "undefined") { i += link + "\n" }
                });

                const embed = new Discord.MessageEmbed()
                    .setColor(colors.Red)
                    .setDescription(`${interaction.user.username} submitted: \n ${i}`)
                    .setTimestamp()
                await channel.send({ content: `<@280094303429197844> New Submission!`, embeds: [embed]}).catch((err) => {})

                const embed1 = new Discord.MessageEmbed()
                    .setColor(colors.Green)
                    .setTitle(`${client.emojis.cache.get(emojis.IconMod).toString()} Link Submission successfull!`)
                    .setDescription(`• Thanks for Submitting, if valid; all links provided will be added as malicious!`)
                    .setTimestamp()
                return await interaction.reply({embeds: [embed1]})
            }
            catch(err)
            {
                return await interaction.reply(`${client.emojis.cache.get(emojis.Bot_Emergency).toString()} An Error Accured!, please contact https://discord.gg/zbeg7vrkvN \n` + "ErrorCode: `skejfgikawesfbskjhfwoigf8234awdawdDaddy`")
            }
        }
    },
};