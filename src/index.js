'use strict';

//uptime
const http = require('http');
const fs = require('fs');
 
const server = http.createServer();
server.on('request', doRequest);
server.listen(3000);
console.log('Server running!');
console.log(process.version)

// リクエストの処理
function doRequest(req, res) {
  let url = req.url;
  if ("/" == url) {
    fs.readFile(`${__dirname}/web/index.html`, "UTF-8", function (err, data) {
      res.writeHead(200, {"Content-Type": "text/html"});
      res.write(data);
      res.end();
    });
  } else if(url.startsWith("/")) {
    console.log(url);
    if (url.match(/\.js$/)) {
      //console.log(url)
      fs.readFile(`${__dirname}/web${url}`, "UTF-8", function (err, data) {
        res.writeHead(200, {"Content-Type": "text/javascript"});
        res.write(data); 
        res.end();
      });
      } else if (url.match(/\.png$/)) {
        res.writeHead(200, {'Content-Type': `image/png; charset=utf-8`});
        var image = fs.readFileSync(`${__dirname}/web${url}`, "binary");
        res.end(image, "binary");
    }
  }
}

//BOT
const Discord = require("discord.js");
const { Logger, ProcessError, SystemError } = require("./system");
const util = require("./util");
const client = util.client
var prefix = process.env.prefix;
var version = "1.5.0";
const db = require("./dbutil.js");

//実行 てかこの辺コード汚すぎる()
const Bot = new (class {
  Run() {
    console.log(util.startsAt)
    const bot = require("./command.js");
    client.on("messageCreate", message => {
      if (!message.author.bot) {
        db.db.set("msgcount", db.db.get("msgcount") + 1);
        bot.Run(message);
      }
    });
  }
})();
//ready

try {
client.on("ready", () => {

  /*process.on('uncaughtException', (err, origin) => {
    new ProcessError(err, origin).log();
  });*/

  console.log(`${client.user.tag} でログインしています。`);
  Logger.log(Logger.Type.START_UP, {date: util.startsAt})
  Bot.Run();
  require("./test.js")

  return;
  let count = 0;
  setInterval(() => {
    const srvkz = client.guilds.cache
      .map(guild => guild.memberCount)
      .reduce((p, c) => p + c);
    const list = [
      `helpはb!help/パッチノートは${prefix}patch`,
	  `1.0.0-dev版のbeta機能を全鯖に配信中!!`,//notice
	  `Ver.${version}/Node.js v16/Discord.js v13導入！！`,
      `起動秒数${db.db.get("time")}秒...
	  /処理したメッセージの数...${db.db.get("msgcount")}個...`,
      `${client.guilds.cache.size}サーバーを監視/鯖の合計人数${srvkz}`
    ];

    client.user.setActivity(list[count], { type: "PLAYING" });
    count++;
    db.db.set("time", db.db.get("time") + 5);

    if (count >= list.length) {
      count = 0;
    }
  }, 1000 * 5);
});

client.login(process.env.token).catch(console.error);
} catch(e) {
  new SystemError(e).log();
}