var express = require("express");

const http = require('http');
const ejs = require('ejs');
const bodyParser = require('body-parser');
 
 //use the application off of express.
 var app = express();

app.use(express.static('public'));
app.use('/images', express.static('images')); 
app.engine('ejs', require('ejs').renderFile);
app.set('view engine', 'ejs'); 
 
 //define the route for "/"
 app.get("/", function (request, response){
     response.sendFile(__dirname+"/views/index.html");
 });
 
 app.get("/getId", function (request, response){
    
    //TODO: user validation needed for the id field
    var id = request.query.id;
 
     if (id != "") {
        let data = "";
        const options = {
            hostname: 'localhost',
            port: '8080',
            path: '/sashidharan/api/getCitizen/' + id,
            headers: {
                Authorization: 'Bearer ' + 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzY29wZSI6WyJ1c2VyX2luZm8iLCJyZWFkIiwid3JpdGUiXSwiZXhwIjoxNjI3NTk3NzEwLCJqdGkiOiIwNjBhNTQ3Ni05N2UyLTRhYjItOTUwOC1lNDkyODM3OGIxMjUiLCJjbGllbnRfaWQiOiJzYXNoaWRoYXJhbiJ9.GN4-zIVZdO9asEBjw_KF4FKR0XfW2jp2Y8bBqwVNi6jrksrV4zaVXBLRD1NsdZyw8nUwHJKmNUpKsGZerjzhFSgEIe7wcSCjaETYRzDpNc3HhrbSKm0jqQYSvJkztWzhxAzSOEH1taCMvsurZroWGd0_0xmVEzECHOUbs_QXIzq7HP5F2v3_f95dcuodWDtBzY5wxv6dfVw5cmUi9sEK2NSilHDKb4zNJTDCOG77WZ2agNKeIcPM_AwsXL_xP23N_8SJ5R_ZFSNq06m1qjg3YAFefhlR-v6pM0sZ2iYFjfm7KxQSZLMre4USuW564GW5sTtIvZ2urLdY1Alb_wOM5w'
            }
        }

        http.get(options, (resp) => {
            
            // A chunk of data has been recieved. Append it with the previously retrieved chunk of data
            resp.on("data", (chunk) => {
              data += chunk;
            });
        
            resp.on("end", () => {
                console.log(JSON.parse(data));
                data = JSON.parse(data);
                console.log(data.nationalId);
            });
            
        }).on("error", error => {
            console.log("Error: " + error.message);
        });
         //TODO: define dirname globally and use relative path
         response.render(url = __dirname + "/views/citizen_view.ejs", 
         {nationalId:data.nationalId,firstName:data.firstName,lastName:data.lastName,occupation:data.occupation,age:data.age});
     } else {
         response.send("Please provide Citizen Id to search");
     }
 });
 
 //start the server
 app.listen(8082);
 
 console.log("Something awesome to happen at http://localhost:8082");