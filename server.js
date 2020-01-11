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
    var options = {
        url: 'https://twitter.com/i/search/timeline?f=live&q=(from%3Arealdonaldtrump)&src=typd',
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
        let responseObject = JSON.parse(body);
        //Return JSON
        res.render("byPerson", {responseObject: responseObject});
    });

}

app.listen(3000);
console.log("Listening on port 3000");
