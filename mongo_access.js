const MongoClient = require('mongodb').MongoClient;

// update to correct mongo database
const url = "mongodb+srv://team_caffein8ed:CKesryAxhYkVu4Hb@cluster0-lqoff.mongodb.net/test?retryWrites=true&w=majority";

// npm install express and body-parser

const express = require('express');
const app = new express();
var port = process.env.PORT || 3000;

var path = 'allmeals.txt';
var autocorrect = require('autocorrect')({dictionary: path});

var bodyParser = require('body-parser');

var cors = require('cors');


app.use(function(req,res,next){
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers','Content-Type');
    next();
});

//Note that in version 4 of express, express.bodyParser() was
//deprecated in favor of a separate 'body-parser' module.
app.use(bodyParser.urlencoded({ extended: true })); 

//app.use(express.bodyParser());

app.post('/submit', function(req, res) {

 // body-parser automatically parses the json so its easy to grab form elements
    var doc = {
    user: req.body.user,
    dish: autocorrect(req.body.dish),
    review: req.body.review,
    }
    console.log(doc);
    
    MongoClient.connect(url, { useUnifiedTopology: true }, function(err, db) {
        if(err) { console.log ("Error: " + err); return; }
        
         // need to update the database name 
        var dbo = db.db("Comp20Final");
        var collection = dbo.collection('recipes');
        
        // insert document into database
        collection.insertOne(doc, function(err, res) {
            if (err) { console.log ("Error: " + err); return; }
            console.log("new document inserted");
        });
        console.log("Success!");
          
          //db.close();
	}); 
	
	res.redirect('https://sejaldua.com/recipe-inspo/thank-you.html');
});


app.post('/get', function(req, res) {
    console.log(req.query);
    var name = req.query;
    console.log("name: " + name);
    
    MongoClient.connect(url, { useUnifiedTopology: true }, function(err, db) {
        if(err) { console.log("Connection err: " + err); return; }
        
        var dbo = db.db("Comp20Final");
        var coll = dbo.collection('recipes');
          
        console.log("before find");
        
        var s = coll.find({"dish":name}).stream();
    
        var found = 0;
        s.on("data", function(item) {
            found = 1;
            console.log(item);
            res.send("Review for " + item.dish + ": " + item.review + " - " + item.user);
        });
           
        s.on("end", function() {
            console.log("end of data");
            db.close();
            // if(found == 0){
            //     result = autocorrect(input);
            //     console.log("No reviews could be found. Did you mean " + result);
            //     res.send("No reviews could be found. Did you mean " + result);
            // }
        });
        console.log("after find");
      
    }); 
});
// makes sure the server is setup correctly
app.listen(port, function () {
    console.log(`App listening on heroku !`);
   });








