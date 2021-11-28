'use strict';

const Discord = require("discord.js");
const { client, slashguild } = require("../util.js")
const { warn } = require("../system")
    //aaa   
const functions = require("../functions.js");

module.exports = async function(length = 0, isNum = false) {
    if (isNum) {
        var c = "0123456789"
    } else {
        var c = "abcdefghijklmnopqrstuvwxyz0123456789";
    }
    var l = isNum;
    var cl = c.length;
    var r = "";
    for (var i = 0; i < l; i++) {
        r += c[Math.floor(Math.random() * cl)];
    }
    return {
        embeds: [functions.getEmbed(
            0x00f521,
            `乱数を生成しました！`,
            r,
            true)]
    }
}