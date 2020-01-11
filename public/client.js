
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