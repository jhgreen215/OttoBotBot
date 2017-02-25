console.log('bleep bloop its me, Otto Bot');

var Twit = require('twit');
var envs = require('envs');
var config = require('./config');
var fetch = require('node-fetch');
var T = new Twit(config);

var params = {
	q: 'KURE885',
	count: 5
}

var KURE_URL = 'http://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=kure885&api_key=f0f1bd44b3ed4f4afa54337d5b482e3f&limit=1&format=json';

T.get('search/tweets', params, gotData);

	
function composeInfoTweet(){
	var artist;
	var song;
	
	fetch(KURE_URL)
	.then(function(res) {
		return res.json();
	}).then(function(json) {
		artist = json.recenttracks.track[0].artist['#text'];
		song = json.recenttracks.track[0].name;
	}).then(function() {
		var beginning = 'Currently on air at 88.5 KURE Ames Alternative: ';
		var middle =  ' by ';
		var returnString = beginning + song + middle + artist;
		console.log(returnString);
		
	});
}
	composeInfoTweet();
	
function gotData(err, data, response) {
	var tweets = data.statuses;
	for (var i = 0; i < tweets.length; i++) {
			console.log(tweets[i].text);
	}	
	if (tweets.length == 0) {
		console.log('no tweets');
	}
}
