
var express = require('express');
var bodyParser = require('body-parser');

var Wit = require('node-wit').Wit; 
var log = require('node-wit').log; 
var interactive = require('node-wit').interactive;
var client = new Wit({accessToken: 'ZNLALCB5EHDJA7FWVVNLHPIXD7MQVNNB'});


////////////////////
// Config Express //
////////////////////

var app = express();
app.set('port', process.env.PORT || 4000);
app.use(express.static(__dirname + "/webapp"));
app.use(bodyParser.json());



//////////////////
// Handle Route //
//////////////////

app.use('/chat', function(req, res) {
  
	client.message(req.body.content, {})
		 .then(function(data){
		 	console.log('Yay, got Wit.ai response: ' + JSON.stringify(data));
            
            handleMessage(data, res);
		 })
		 .catch(function(e){
		 	console.log(e);
		 	res.send("hello error");
		 });
});

//////////////////
// Handle Logic //
//////////////////
var handleMessage = function(data, res){
	
    var oResponse = {};
	
    if(data.entities){
        if(data.entities.product){
            oResponse.content = "What would you like to know about " + data.entities.product[0].value + "?";
        }else if (data.entities.greetings){
            oResponse.content = "Hi, How can I help you?";
        }else{
            oResponse.content = "Sorry Can you give me more info?";
        }
        
    }else{
        oResponse.content = "Sorry I didnt undertand";
    }
    res.send(oResponse);
};


////////////////////
// Start Express  //
////////////////////

app.listen(app.get('port'), function() {
  console.log('Our bot is running on port', app.get('port'))
});