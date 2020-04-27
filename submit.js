const MongoClient = require('mongodb').MongoClient;

// update to correct mongo database
const url = "mongodb+srv://Henry69Caron420:aMw8pQnoEqlanXEk@cluster0-h3reo.mongodb.net/test?retryWrites=true&w=majority";

// npm install express and body-parser

const express = require('express');
const app = new express();

// port refers to heroku server
// var port = process.env.PORT || 3000;

var bodyParser = require('body-parser');

//Note that in version 4 of express, express.bodyParser() was
//deprecated in favor of a separate 'body-parser' module.
app.use(bodyParser.urlencoded({ extended: true })); 

//app.use(express.bodyParser());

app.post('/myaction', function(req, res) {

 // body-parser automatically parses the json so its easy to grab form elements
    var doc = {
    name: req.body.name,
    ingredients: req.body.ingredients,
    description: req.body.description,
    }
    console.log(doc);
    res.send(doc);
    // MongoClient.connect(url, { useUnifiedTopology: true }, function(err, db) {
    //     if(err) { console.log ("Error: " + err); return; }
        
    //      // need to update the database name 
    //     var dbo = db.db("??");
    //     var collection = dbo.collection('??');
        
    //     // insert document into database
    //     collection.insertOne(doc, function(err, res) {
    //         if (err) { console.log ("Error: " + err); return; }
    //         console.log("new document inserted");
    //     });
    //     console.log("Success!");
          
    //       //db.close();
	// }); 
});

app.listen(8080, function () {
    console.log(`Example app listening on port !`);
});







