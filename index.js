// Example express application adding the parse-server module to expose Parse
// compatible API routes.
const bodyParser = require('body-parser');
const Line = require('@line/bot-sdk');

const line_config = {
    'channelAccessToken': 'f2MajD6Z345rRsMBa2Fy5mBZiIoKLHjXxTwzdwa+0u9bjU81Ol5xEzs9qGFbtZBq6pnWOcAPyr7rXct8ioiPTF0DGqIWMzkenvBgkknNQwyt+XiC1FCgw1et6wRZekd0UgXgofUuFA7o4VuhsYktmAdB04t89/1O/w1cDnyilFU=',
    'channelSecret': '06a81a47dc5dedd901520db7a464ed75'
};
const client = new Line.Client(line_config);

var express = require('express');
var ParseServer = require('parse-server').ParseServer;
var path = require('path');
var ParseDashboard = require('parse-dashboard');
var allowInsecureHTTP = true;
var dashboard = new ParseDashboard({
    "allowInsecureHTTP": true,
    "apps": [{
        "serverURL": 'http://localhost:1337/parse',
        "appId": 'myAppId',
        "masterKey": 'test',
        "appName": 'test'
    }],

    "users": [{
        "user": 'admin',
        "pass": 'pass'
    }]
}, { allowInsecureHTTP: allowInsecureHTTP });

var api = new ParseServer({
    databaseURI: 'mongodb+srv://zenonxenon:zenon84130@test-cs3204.ytlck.mongodb.net/test?retryWrites=true&w=majority',
    cloud: process.env.CLOUD_CODE_MAIN || __dirname + '/cloud/main.js',
    appId: process.env.APP_ID || 'myAppId',
    masterKey: process.env.MASTER_KEY || 'test', //Add your master key here. Keep it secret!
    serverURL: process.env.SERVER_URL || 'http://localhost:1667/parse', // Don't forget to change to https if needed
    liveQuery: {
        classNames: ["Posts", "Comments"] // List of classes to support for query subscriptions
    }
});
// Client-keys like the javascript key or the .NET key are not necessary with parse-server
// If you wish you require them, you can set them as options in the initialization above:
// javascriptKey, restAPIKey, dotNetKey, clientKey

var app = express();
app.use(bodyParser.json());
app.use('/parse-dashboard', dashboard);
// Serve static assets from the /public folder
app.use('/public', express.static(path.join(__dirname, '/public')));

// Serve the Parse API on the /parse URL prefix
var mountPath = process.env.PARSE_MOUNT || '/parse';
app.use(mountPath, api);

// Parse Server plays nicely with the rest of your web routes
app.get('/', function(req, res) {

    res.sendFile(path.join(__dirname, '/public/index.html'));
});
app.get('/crma', function(req, res) {
    res.status(200).send('Cdt.piyapoom Promwong no.2 computer science ');
});

app.get('/data', function(req, res) {
    var name = req.query.name
    res.send('hello' + name);
});
app.post('/data', function(req, res) {

    var name = req.body.name
    name = name + 'hello'
    res.send(name);
});
app.post('/saveData', async(req, res) => {
    const username = req.body.username
    const name = req.body.name
    const nickname = req.body.aka
    const Members = Parse.Object.extend('Members')
    const data = new Members()
    data.set('username', username)
    data.set('name', name)
    data.set('nickname', nickname)
    const saveResult = await data.save()
    res.send(saveResult)
});
app.post('/saveData', async(req, res) => {
    console.log("LINE WEBHOOK" + JSON.stringfy(req.body))
    res.sendStatus(200)
});

// There will be a test page avacilable on the /test path of your server url
// Remove this before launching your app
app.get('/test', function(req, res) {
    res.sendFile(path.join(__dirname, '/public/test.html'));
});

var port = process.env.PORT || 1667;
var httpServer = require('http').createServer(app);
httpServer.listen(port, function() {
    console.log('parse-server-example running on port ' + port + '.');
});

// This will enable the Live Query real-time server
ParseServer.createLiveQueryServer(httpServer);