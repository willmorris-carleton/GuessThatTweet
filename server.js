const express = require('express');
let app = express();

//To serve up index.html and client side javascript
app.use(express.static("public"));

app.listen(3000);
console.log("Listening on port 3000");
