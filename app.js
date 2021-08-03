const serverless = require('serverless-http');
const express = require("express");

const http = require('http');
const ejs = require('ejs');
const bodyParser = require('body-parser');
 
 //use the application off of express.
 var app = express();

app.use(express.static('public'));
app.use('/images', express.static('images')); 
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use(bodyParser.urlencoded({
    extended: true
  }));
app.use(bodyParser.json());
 
 //define the route for "/"
app.get("/", function (request, response){
     response.sendFile(__dirname + "/views/index.html");
 });
 
app.get("/getCitizenSummary", function (request, response){
    
    //TODO: user validation needed for the id field
    var id = request.query.id;
 
     if (id != "") {
        let data = "";
        const options = {
            hostname: 'localhost',
            port: '8080',
            path: '/sashidharan/api/getCitizen/' + id,
            headers: {
                Authorization: 'Bearer ' + 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzY29wZSI6WyJ1c2VyX2luZm8iLCJyZWFkIiwid3JpdGUiXSwiZXhwIjoxNjI4MDI0NjcwLCJqdGkiOiJlMzMwMWM5Ny04Yjg4LTQ5ZGQtODNhZS1kOGRhYmFhZWZkNzMiLCJjbGllbnRfaWQiOiJzYXNoaWRoYXJhbiJ9.ib1GlRk6ZGgRSVFmhRoZpvT_-Uxp7mwW_6A7zrRopzaczF7RNK85TDVz74nMSiY0EQE6fG4J9ONcJT08xeIA-ParSobPKLD3RTXiiQZZeaWNLC0PXNqhjecK6OQxd64EhDV5OHQZDz9UPxDczVE0PeCDK8-cj_HETnk012O56uJO5xNjjqoqibpHhBYmBpYc6cugaOYQ-t4bEa98ShL0IQ1luP8OxjZGEdgsPX7UzGn6_S_ZNYula15eqw8x3twIEcQcAVbUYf0JRICMizu6FWSjnsSV5mG4REQND_4VbQJwxtxXBqpZLe9x-OMQ2U9tJEnsssAtbuxIwDnJIKziJQ'
            }
        }

        http.get(options, (resp) => {
            
            resp.on("data", (chunk) => {
              data += chunk;
            });
        
            resp.on("end", () => {
                console.log(JSON.parse(data));
                data = JSON.parse(data);
                response.render(url =__dirname + "/views/citizen_view.html", 
                {nationalId: data.nationalId,
                firstName: data.firstName,
                lastName: data.lastName,
                occupation: data.occupation,
                age: data.age});
            });

        }).on("error", error => {
            console.log("Error: " + error.message);
        });
         
     } else {
         response.render(url =__dirname + "/views/error.html", {errorHeader: "Please provide Citizen Id to search", errorMessage: "click back to goto Id input screen"});
     }
 });
 
 //start the server
app.listen(8082);
 
console.log("Something awesome to happen at http://localhost:8082");
module.exports.handler = serverless(app);