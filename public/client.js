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
    currentPerson = input;
    socket.emit('getNewGame', currentPerson);
}

function submitAnswer() {

}