const express = require('express');
const request = require('request');
let app = express();
let server = require('http').Server(app);
let io = require('socket.io').listen(server);

//To serve up index.html and client side javascript
app.use(express.static("public"));
app.set("view engine", "pug");

app.get("/", getIndex);
app.get("/tweetsByPerson", getTweetsByPerson)
app.get("/tweetsByPerson/:person", getTweetsByPersonSpecific, getTweetsByPerson);


function getIndex(req,res,next) {
    res.render("index");
}

function getTweetsByPerson(req,res,next) {
    res.render("byPerson", {responseObject: null});
}

function getTweetsByPersonSpecific(req,res,next) {
    if (!req.params.person) {
        next(); //No specific person given so just give general page
        return;
    }
    let search = req.params.person;
    let link = createLink(search);
    console.log(link);
    var options = {
        url: link,
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Accept-Charset': 'utf-8'
        }
    };
    //Parse request into an object with the questions. Add those questions and info on the current round to the global round object
    request(options, function(err, resp, body) {
        if (err) {
            res.status(500).send("Poop :)");
        }
        console.log("Rand Request Finished");
        let responseObject = parseTweets(JSON.parse(body));
        //Return JSON
        res.render("byPerson", {responseObject: responseObject});
    });

}


function parseTweets(tweetJson){
	tweetsArray = [];
	idsArray =[];
	tweetStr = JSON.stringify(tweetJson);
	//let index = tweetStr.search('js-tweet-text tweet-text')
	while(true){
		
		let idIndex = tweetStr.search('stream-item-tweet-');//18 characters before id
		if(idIndex<0){
			break;//No more tweets available
		}
		
		tweetStr = tweetStr.slice(idIndex+18);
		let newId = tweetStr.slice(0,19);
		tweetStr = tweetStr.slice(19);
		idsArray.push(newId);

		let index = tweetStr.search('js-tweet-text tweet-text')//66 characters before the tweet starts
		if(index<0){
			break;//If no more tweets available
		}
		
		tweetStr = tweetStr.slice(index+66);//Slices the json string to start right at the beginning of the current tweet
		let endIndex = tweetStr.search('</p>');//This is always after a tweet
		let newTweet = tweetStr.slice(0,endIndex);
		tweetStr = tweetStr.slice(endIndex);//Slices off that tweet so that it can keep going
		tweetsArray.push(newTweet);
	}
	
	//This part goes through each tweets and gets rid of the html tags
	for(let i=0; i<tweetsArray.length; i++){
		while(true){
			//Searches for additional pieces of inside html (@'s #'s etc.)
			let htmlIndex = tweetsArray[i].search("<");
			let htmlEndIndex = tweetsArray[i].search(">");
			if(htmlIndex<0){
				break;//If none found break
			}
			
			tweetsArray[i] = tweetsArray[i].slice(htmlIndex, htmlEndIndex);
		}
	}
	
	if(tweetsArray.length != idsArray.length){
		console.log("Tweets array and ids array not the same length");
		return []
	}else{
		let jsonArray = [];
		for(let i=0; i<tweetsArray.length; i++){
			let newjsonObj = {"text":tweetsArray[i], "id":idsArray[i]};
			jsonArray.push(newjsonObj);
        }
        return jsonArray;
	}
}

function tweetPicker(tweetsjson){
	let rounds = 5; //Change as needed
	
	let textArray = [];
	let idArray = [];
    console.log(tweetsjson);
	tweetsjson = arrayShuffle(tweetsjson); //Shuffles the array 
	
	/*
	for(let i =0; i<tweetsjson.length; i++){//Splits the json into its text and id components
		textArray.push(tweetsjson[i].text);
		idArray.push(tweetsjson[i].id);
	}*/
	
	let picked = [];
	
	for(let i=0; i<tweetsjson.length; i++){
		let wordArray = tweetsjson[i].text.split(" "); //Split the text into an array of separate words
		if(wordArray.length < 5){//Skips arrays with less than 5 words
			continue;
		}
		
		let flag = false;
		
		for(let j=0; j<wordArray.length; j++){//Makes sure at least one word is longer than 3 letters
			if(wordArray[j].length > 3){
				flag = true;
				break;
			}
		}
		
		if(flag){//If the tweet passes it goes on the picked array
			picked.push(tweetsjson[i]);
		}
		
		if(picked.length>rounds){//Once we have a tweet for each round break
			break;
		}
		
		
	}
	
	
	return picked;
}

function arrayShuffle(array){
	let length = array.length;
	
	while(length>0){
		
		let index = Math.floor(Math.random() * length);
		
		length--;
		
		let temp = array[length];
		array[length] = array[index];
		array[index] = temp;
	}
	return array;
}

function createLink(username){
	return "https://twitter.com/i/search/timeline?f=live&q=(from%3A" + username + ")%20lang%3Aen%20-filter%3Alinks%20-filter%3Areplies&src=typd"
}

function getEmbedLink(username,id){
	return "https://publish.twitter.com/?query=https%3A%2F%2Ftwitter.com%2F" + username +"%2Fstatus%2F"+ id + "&widget=Tweet"
}

function chooseWord(sentence){
    let nonoWords = ["she", "herself", "you", "are", "that", "they", "each", "few", "many", "who", "whoever", "whose"]; //Get rid of pronouns
    let words = sentence.replace(/[(\r\n|\r|\n)\n.,\/#!?+$%\^&\*;:{}=_`~()]/g,"").split(" "); //Get rid of any punctuation
    words = words.filter(function(word) {
        return word.length > 3 && !nonoWords.includes(word);
    }); //Filter words by size and nonoWords
    let randIndex = Math.floor(Math.random()*words.length);
    let spaces = "";
    let lengthS = words[randIndex].length;
    for (let i = 0; i < lengthS; i++) {
        spaces += "_";
    }
    return {"word": words[randIndex], "length":lengthS, "oldSentence":sentence, "newSentence":sentence.replace(/\\/g,"").replace(words[randIndex], spaces)}
}

server.listen(3000);
console.log("Listening on port 3000");

function getTweetsByPersonArray(username, sock) {
    let search = username;
    let link = createLink(search);
    console.log(link);
    var options = {
        url: link,
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Accept-Charset': 'utf-8'
        }
    };
    //Parse request into an object with the questions. Add those questions and info on the current round to the global round object
    request(options, function(err, resp, body) {
        if (err) {
            console.log(err);
            return null;
        }
        console.log("Rand Request Finished");

		let parsedTweets = parseTweets(JSON.parse(body));
		console.log(parsedTweets);
		let picked = tweetPicker(parsedTweets);
		console.log("VVVV");
        for (let i = 0; i < picked.length; i++) {
            picked[i]['wordChosen'] = chooseWord(picked[i]['text']);
        }
        //console.log(picked);
        sock.emit('roundJSON', picked);
    });
}

const numRounds = 5;
//SOCKETS
io.on('connection', function (socket) {
    console.log("A connection was made!");
    socket.on('getNewGame', function(username){
        //Make 5 randos based off of request
        console.log(username)
        getTweetsByPersonArray(username, socket);
    });
    

});