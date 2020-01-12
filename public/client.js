const domain = 'http://localhost:3000/';
let currentPerson = "";

function initSockets() {
    socket = io.connect(domain);
    console.log("Socket Connected")
    socket.on("roundJSON", function(picked){
        console.log(JSON.stringify(picked));
    });
}

function makeRequest() {
    let input = document.getElementById("textInput").value;
    //Make the request
    req = new XMLHttpRequest();
    req.onreadystatechange = function() {
        if(this.readyState==4 && this.status == 200){
            let div = document.getElementById("responseDiv");
            div.innerHTML = JSON.stringify(this.responseText);
            let searchDiv = document.getElementById("choosePerson");
            searchDiv.style.display = "none";
        }
    }
    req.open("GET", '/tweetsByPerson/'+input);
    req.setRequestHeader("Content-Type", "text/html");
    req.send();
<<<<<<< HEAD
    currentPerson = input;
    socket.emit('getNewGame', currentPerson);
}

function submitAnswer() {
=======
}

function revealTweet(){
    let tweetDiv = document.getElementById("tweetDiv");
    let styleDiv = document.getElementById("newStyle");

    //This block gets the tweet text out of the embedded block
    let originalHtml = tweetDiv.innerHTML;
    let index = originalHtml.search('<p class="Tweet-text e-entry-title" lang="en" dir="ltr">');
    let tweetBlock = originalHtml.slice(index);
    originalHtml = originalHtml.slice(index);
    let endIndex  = originalHtml.search("</p>");
    tweetBlock = tweetBlock.slice(0,endIndex);


    //This eliminates the text from the page
    originalHtml = tweetDiv.innerHTML;
    originalHtml = originalHtml.replace(tweetBlock);
    tweetDiv.innerHTML = originalHtml;
    console.log("HERE")
    //This reveals the tweet
    styleDiv.innerHTML = "<style>.tweetDiv{display:inline !important}</style>";
>>>>>>> 22198b4f0646454513c993f83667bd05d00f0d90

}