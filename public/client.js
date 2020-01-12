
function makeRequest() {
    let input = document.getElementById("textInput").value;
    //Make the request
    req = new XMLHttpRequest();
    req.onreadystatechange = function() {
        if(this.readyState==4 && this.status == 200){
            let div = document.getElementById("responseDiv");
            div.innerHTML = JSON.stringify(this.responseText);
        }
    }
    req.open("GET", '/tweetsByPerson/'+input);
    req.setRequestHeader("Content-Type", "text/html");
    req.send();
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

}