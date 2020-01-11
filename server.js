const express = require('express');
const request = require('request');
let app = express();

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
			let newjsonObj = {"text":tweetArray[i], "id":idsArray[i]};
			jsonArray.push(newjsonObj);
		}
	}
	return jsonArray;
}

function createLink(username){
	return "https://twitter.com/i/search/timeline?f=live&q=(from%3A" + username + ")%20lang%3Aen%20-filter%3Alinks%20-filter%3Areplies&src=typd"
}

function getEmbedLink(username,id){
	return "https://publish.twitter.com/?query=https%3A%2F%2Ftwitter.com%2F" + username +"%2Fstatus%2F"+ id + "&widget=Tweet"
}

app.listen(3000);
console.log("Listening on port 3000");
