var HTTPS = require('https');
var cool = require('cool-ascii-faces');
var botID = process.env.BOT_ID;
var memberList = [];

function respond() {
    var request = JSON.parse(this.req.chunks[0]),
        botRegex = /^\/cool guy/;
    var aliveReq = /^\/alive/;
    var addReq = /^\/add/;
    var help = /^\/help/;
    var zombot = /zombot/;

    if (request.text && botRegex.test(request.text)) {
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
        this.res.end();
    } else if (request.text && addReq.test(request.text)) {
        this.res.writeHead(200);
        addMember(request.text);
        this.res.end();
    } else {
        console.log("don't care");
        this.res.writeHead(200);
        this.res.end();
    }
}

function postMessage(numVal) {
    var botResponse, options, body, botReq;
    botResponse = "";
    if (numVal == 1) {
        botResponse = "****HELP MENU****"
                    + "\ncurrent functions include:"
                    + "\n/cool guy = displays a face"
                    + "\n/help = displays help menu";
    } else if (numVal == 2) {
        botResponse = cool();
    } else if (numVal == 3) {
        botResponse = "Hi!";
    } else if (numVal == 4) {
        botResponse = "addMember is working";
    } else if (numVal == 5) {
        for(var j = 0; j<memberList.length; j++){
            botResponse += memberList[j].fn + " " + memberList[j].ln;
            if(memberList[j].alive)
                botResponse += " is a HUMAN\n";
            else
                botResponse += " is a ZOMBIE\n";
        }
    } else {
        botResponse = "error 001: please tell ryan";
    }


    options = {
        hostname: 'api.groupme.com',
        path: '/v3/bots/post',
        method: 'POST'
    };

    body = {
        "bot_id": botID,
        "text": botResponse
    };

    console.log('sending ' + botResponse + ' to ' + botID);

    botReq = HTTPS.request(options, function (res) {
        if (res.statusCode == 202) {
            //neat
        } else {
            console.log('rejecting bad status code ' + res.statusCode);
        }
    });

    botReq.on('error', function (err) {
        console.log('error posting message ' + JSON.stringify(err));
    });
    botReq.on('timeout', function (err) {
        console.log('timeout posting message ' + JSON.stringify(err));
    });
    botReq.end(JSON.stringify(body));
}

function testString(str) {
    var botResponse, options, body, botReq;
    botResponse = str;
    options = {
        hostname: 'api.groupme.com',
        path: '/v3/bots/post',
        method: 'POST'
    };

    body = {
        "bot_id": botID,
        "text": botResponse
    };

    console.log('sending ' + botResponse + ' to ' + botID);

    botReq = HTTPS.request(options, function (res) {
        if (res.statusCode == 202) {
            //neat
        } else {
            console.log('rejecting bad status code ' + res.statusCode);
        }
    });

    botReq.on('error', function (err) {
        console.log('error posting message ' + JSON.stringify(err));
    });
    botReq.on('timeout', function (err) {
        console.log('timeout posting message ' + JSON.stringify(err));
    });
    botReq.end(JSON.stringify(body));
}

function addMember(name) {
    var splt = name.split(" ");
    var firstname = splt[1];
    var lastname = splt[2];
    var isAlive = true;
    var member = { fn: firstname, ln: lastname, alive: isAlive};
    memberList.push(member);
    postMessage(5);
}

exports.respond = respond;
