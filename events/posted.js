require("dotenv").config();
const Discord = require("discord.js");
const client = require("../bot.js");
const con = require("../database/connection");
const { AutoPoster } = require('topgg-autoposter')
const Topgg = require(`@top-gg/sdk`)
const colors = require("../utils/colors");
const api = new Topgg.Api(process.env.TOPGGTOKEN)
const ap = AutoPoster(process.env.TOPGGTOKEN, client)
const { glob } = require("glob");
const { promisify } = require("util");


ap.on('posted', () => {
    console.log('Posted stats to Top.gg!')
})