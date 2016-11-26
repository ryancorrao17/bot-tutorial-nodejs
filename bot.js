var HTTPS = require('https');
var cool = require('cool-ascii-faces');

var botID = process.env.BOT_ID;

function respond() {
  var request = JSON.parse(this.req.chunks[0]),
      botRegex = /^\/cool guy/;
  var aliveReq = /^\/alive/;
  var addReq = /^\/add/;
  var help = /^\/help/;
  var zombot = /zombot/;

  if(request.text && botRegex.test(request.text)) {
    this.res.writeHead(200);
    postMessage(2);
    this.res.end();
  } else if (request.text && zombot.test(request.text)) {
    this.res.writeHead(200);
    postMessage(3);
    this.res.end();
  } else if (request.text && help.test(request.text)) {
    this.res.writeHead(200);
    postMessage(1);
  } else {
    console.log("don't care");
    this.res.writeHead(200);
    this.res.end();
  }
}

function postMessage(num) {
  var botResponse, options, body, botReq;
  if(num == 1) {
    botResponse = "****HELP MENU****""
                + "\ncurrent functions include:"
                + "\n//cool guy = displays a face"
                + "\n//help = displays help menu";
  } else if (num == 2) {
    botResponse = cool();
  } else if (num == 3) {
    botResponse = "Hi, I'm zombot!";
  } else if (num == 4) {
    botResponse = "";
  } else {
    botResponse = "error 001: please tell ryan";
  }
  

  options = {
    hostname: 'api.groupme.com',
    path: '/v3/bots/post',
    method: 'POST'
  };

  body = {
    "bot_id" : botID,
    "text" : botResponse
  };

  console.log('sending ' + botResponse + ' to ' + botID);

  botReq = HTTPS.request(options, function(res) {
      if(res.statusCode == 202) {
        //neat
      } else {
        console.log('rejecting bad status code ' + res.statusCode);
      }
  });

  botReq.on('error', function(err) {
    console.log('error posting message '  + JSON.stringify(err));
  });
  botReq.on('timeout', function(err) {
    console.log('timeout posting message '  + JSON.stringify(err));
  });
  botReq.end(JSON.stringify(body));
}

exports.respond = respond;
