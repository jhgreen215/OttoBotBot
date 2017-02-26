console.log('bleep bloop its me, Otto Bot');

require('dotenv').config();

var Twit = require('twit');


var fetch = require('node-fetch');
var T = new Twit({
    consumer_key: process.env.consumer_key,
    consumer_secret: process.env.consumer_secret,
    access_token: process.env.access_token,
    access_token_secret: process.env.access_token_secret

});
var lastSong;
var lastArtist;
var canTweet = true;
var KURE_URL = 'http://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=kure885&api_key=f0f1bd44b3ed4f4afa54337d5b482e3f&limit=1&format=json';

var stream = T.stream('user');
	
stream.on('tweet', tweetEvent);

function tweetEvent(eventMsg) {
	console.log('Tweet found!');
	//var fs = require('fs');
	//var json = JSON.stringify(eventMsg, null, 2);
	//fs.writeFile("tweet.json", json);
	var taggedUser = eventMsg.in_reply_to_screen_name;
	var tweetText = eventMsg.text;
	var user = eventMsg.user.screen_name;
	
	var newTweet = taggedUser + user + tweetText;
	
	if (taggedUser === 'OttoBot93') {
		var searchText = tweetText.toLowerCase();
		var test1 = searchText.match(/what'?s?\s*[playing|on\-?\s?air]/);
		var test2 = searchText.match(/[what]*\s*[which]*\s*(song|artist|band)\s*/);

		if(!!test1 || !!test2){
			composeInfoTweet(user);
		}
	}
}

function composeInfoTweet(user){
	var artist;
	var song;
	
	fetch(KURE_URL)
	.then(function(res) {
		return res.json();
	}).then(function(json) {
		artist = json.recenttracks.track[0].artist['#text'];
		song = json.recenttracks.track[0].name;
	}).then(function() {
		var beginning = ' Currently on air at 88.5 KURE Ames Alternative: ';
		var middle =  ' by ';
		var returnString = '.@' + user + beginning + song + middle + artist;
		var tweet = {
			status: returnString
		}
		
		if (lastSong != song && lastArtist != artist) {
			console.log('Info not yet tweeted!');
			console.log(returnString);
			canTweet = true;
			T.post('statuses/update', tweet, tweeted);
			
		} else if (lastSong == song && lastArtist == artist && canTweet) {
			console.log('Info already tweeted!');
			tweetDuplicateInfo();
			canTweet = false;
		}
		
		lastSong = song;
		lastArtist = artist;
		
	});
}
	
function tweetDuplicateInfo() {
var tweet = {
	status: 'Foolish human, surely you already know what is currently playing'
	}
	
T.post('statuses/update', tweet, tweeted);
}

function tweeted(err, data, response) {
			if (err) {
				console.log("Something went wrong with tweeting song info!");
			} else {
				console.log("On air info tweeted!");
			}
}



function test() {
	var user = 'ronnygreen215';
	var taggedUser = 'OttoBot93';
	var tweetText = 'hey otto what songs?';
	
	if (taggedUser === 'OttoBot93') {
		var searchText = tweetText.toLowerCase();
		//this is probably horrible regex usage, oh well
		var test1 = searchText.match(/what'?s?\s*[playing|on\-?\s?air]/);
		var test2 = searchText.match(/[what]*\s*[which]*\s*(song|artist|band|listening)\s*/);
		if(!!test1 || !!test2){
				composeInfoTweet(user);
			
		}
	}
}
