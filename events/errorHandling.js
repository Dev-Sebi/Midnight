require("dotenv").config();
const Discord = require("discord.js");
const client = require("../bot.js");
const con = require("../database/connection");
const { AutoPoster } = require('topgg-autoposter')
const Topgg = require(`@top-gg/sdk`)
const emojis = require("../utils/emojis.js");
const colors = require("../utils/colors");
const api = new Topgg.Api(process.env.TOPGGTOKEN)
const ap = AutoPoster(process.env.TOPGGTOKEN, client)
const { glob } = require("glob");
const { promisify } = require("util");
const badwords = require("../utils/badwords")

const id = "924064915940057108"
const ownerping = "<@280094303429197844>"

process.on("unhandledRejection", async (reason, p) => {
    const channel = await client.channels.cache.find(ch => ch.id === id)
    const errEmbed = new Discord.MessageEmbed()
        .setColor(colors.Red)
        .setTitle("⚠️ new Error!")
        .setDescription("An error just occured in the bot console!**\n\nERROR:\n** ```" + reason + "\n\n" + p + "```")
        .setTimestamp()
        .setFooter("Anti-Crash System")
        
    channel.send({content: ownerping, embeds: [errEmbed]})
})

process.on("uncaughtException", async (error, origin) => {
    const channel = await client.channels.cache.find(ch => ch.id === id)
    const errEmbed = new Discord.MessageEmbed()
        .setColor(colors.Red)
        .setTitle("⚠️ new Error!")
        .setDescription("An error just occured in the bot console!**\n\nERROR:\n** ```" + error + "\n\n" + origin + "```")
        .setTimestamp()
        .setFooter("Anti-Crash System")
        
    channel.send({content: ownerping, embeds: [errEmbed]})
})

process.on("uncaughtExceptionMonitor", async (error, origin) => {
    const channel = await client.channels.cache.find(ch => ch.id === id)
    const errEmbed = new Discord.MessageEmbed()
        .setColor(colors.Red)
        .setTitle("⚠️ new Error!")
        .setDescription("An error just occured in the bot console!**\n\nERROR:\n** ```" + error + "\n\n" + origin + "```")
        .setTimestamp()
        .setFooter("Anti-Crash System")
        
    channel.send({content: ownerping, embeds: [errEmbed]})
})

process.on("multipleResolves", async (type, promise, reason) => {
    const channel = await client.channels.cache.find(ch => ch.id === id)
    const errEmbed = new Discord.MessageEmbed()
        .setColor(colors.Red)
        .setTitle("⚠️ new Error!")
        .setDescription("An error just occured in the bot console!**\n\nERROR:\n** ```" + type + "\n\n" + promise + "\n\n" + reason + "```")
        .setTimestamp()
        .setFooter("Anti-Crash System")
        
    channel.send({content: ownerping, embeds: [errEmbed]})
})