var http = require('http'); // Fait appel à http.js
var url = require('url'); // Fait appel à url.js
var express = require('express');
var Twit = require('twit');
var bodyParser = require('body-parser');
var session = require('express-session');
var cookieParser = require('cookie-parser');

var app = express();

app.use(session({secret:'secretissecret'}));
app.use(cookieParser());
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.use(express.static('public'));

app.set('view engine', 'html');
app.set('views',__dirname + '/views');



app.get('/', function(req, res) {
	res.sendFile("canyoufeedit.html", {"root": __dirname + '/views'});
	req.session.userWord = "";
});

app.post('/', function(req, res) {
	var userWord = req.body.word;
	req.session.userWord = userWord;
	res.send(userWord);
});

app.get('/twit', function(req, res) {

	var config = require('./config.json');
	console.log(req.session.userWord);

	var T = new Twit({
		   consumer_key: config.consumer_key
		  , consumer_secret: config.consumer_secret
		  , access_token: config.access_token
		  , access_token_secret: config.access_token_secret
		});

	//  search twitter user_timeline
	T.get('search/tweets', { q: req.session.userWord, count: 100 }, function(err, data, response) {
	  	res.send(data);
	});

	/*T.get('statuses/home_timeline', { }, function(err, data, response) {
	  	
	})*/
    
});



app.listen(8080);

