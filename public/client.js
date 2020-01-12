const domain = 'http://localhost:3000/';
let currentPerson = "";
let currentRound = 0;
let picked = null;

function initSockets() {
    socket = io.connect(domain);
    console.log("Socket Connected")
    socket.on("roundJSON", function(picke){
        console.log(JSON.stringify(picke));
        picked = picke;
        currentRound = -1;
        //Create Dom elements inside responseDiv
        createDomElemsOfRound();
    });
}

function makeRequest() {
    let input = document.getElementById("textInput").value;
    currentPerson = input;
    //Make the choose person div dissapear
    let div = document.getElementById("choosePerson");
    div.style.display = "none";
    socket.emit('getNewGame', currentPerson);
}

function createDomElemsOfRound(){
    currentRound++;
    let div = document.getElementById("responseDiv");
    div.innerHTML = "";
    if (currentRound > 4) {
        //Make the choose person div reappear
        div.style = "";
        currentRound = -1;
    }
    else {
        let tweetH = document.createElement("h2");
        tweetH.innerHTML = picked[currentRound]["wordChosen"]["newSentence"];
        div.appendChild(tweetH);
        let pHint = document.createElement("p");
        pHint.innerHTML = "Letters in word: " + picked[currentRound]["wordChosen"]["length"];
        div.appendChild(pHint);
        let textBoxInp = document.createElement("input");
        textBoxInp.type = "text";
        textBoxInp.id = "guessInp";
        div.appendChild(textBoxInp);
        let buttonInput = document.createElement("input");
        buttonInput.type = "button";
        buttonInput.value = "Enter Guess";
        buttonInput.onclick = enterGuess;
        div.appendChild(buttonInput);
    }
    
}

function enterGuess() {
    let input = document.getElementById("guessInp").value;
    if (input === picked[currentRound]["wordChosen"]["word"]) {
        alert("CORRECT!");
    }
    else{
        alert("INCORRECT!");
    }
    createDomElemsOfRound();
}