var express = require('express');
var bodyParser = require('body-parser');

var Wit = require('node-wit').Wit; 
var log = require('node-wit').log; 
var interactive = require('node-wit').interactive;
var client = new Wit({accessToken: 'ZNLALCB5EHDJA7FWVVNLHPIXD7MQVNNB'});


const NONE = 1;
const INTENT_INOVATION = 2;
const RELEASE_CURRENT = 4;
const RELEASE_PREVIOUS = 8;
const RELEASE_ALL = 16;
const PRODUCT_SF = 32;
const PRODUCT_ALL = 64;
const GREETING = 128;
const INTENT_FILTER = 256;

////////////////////
// Config Express //
////////////////////

var app = express();
app.set('port', process.env.PORT || 4000);
app.use(express.static(__dirname + "/webapp"));
app.use(bodyParser.json());


////////////////////
//  Context  Maps //
////////////////////

var oContext = {};
var mChatContext = new Map();
function generateQuickGuid() {
    return Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15);
}

//////////////////
// Handle Route //
//////////////////

app.use('/chat', function(req, res) {
	
	if(req.body.id != undefined && req.body.id != "undefined"){

        oContext = mChatContext.get(req.body.id);
        if(!(oContext && oContext.id)){
            var newId = generateQuickGuid();
  		    oContext = {id : newId, oChatSet: new Set()};
  		    mChatContext.set(newId, oContext);
        }

	}else{
        var newId = generateQuickGuid();
  		oContext = {id : newId, oChatSet: new Set()};
  		mChatContext.set(newId, oContext);
    }
  
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
function handleMessage(data, res){
	
    var oResponse = {};
    oResponse.id = oContext.id;

    var sGreeting = firstEntityValue(data.entities, "greetings");
    var sIntent = firstEntityValue(data.entities, "intent");
    var sProduct = firstEntityValue(data.entities, "product");
    var sModule = firstEntityValue(data.entities, "module");


    if(sGreeting && sGreeting === "true" ){
        oResponse.content = "Hello, I can help you filter the CAA Tool.";
        return res.send(oResponse);
    }
    if(sProduct && sProduct === "Success Factors"){
        if(sModule && sModule != ""){
            oResponse.content = "Ok I will filter the fetures list to show only items for " + sModule;
            oResponse.filterModule = sModule;
            return res.send(oResponse);
        }else{
            oResponse.content = "What module would you like to filter success factors?";
            return res.send(oResponse);
        }
    }

    if(sIntent && sIntent === "filter"){
        if(sModule && sModule != ""){
            oResponse.content = "Ok I will filter the fetures list to show only items for " + sModule;
            oResponse.filterModule = sModule;
            return res.send(oResponse);
        }else{
            oResponse.content = "Can you tell me for which module? ";
            return res.send(oResponse);
        }
    }
    oResponse.content = "I can help you filter the feature list, what module would you like to filter?";
    return res.send(oResponse);
    
};


function firstEntityValue(entities, entity) {
    const val = entities && entities[entity] &&
      Array.isArray(entities[entity]) &&
      entities[entity].length > 0 &&
      entities[entity][0].value
    ;
    if (!val) {
      return null;
    }
    return val;
};

function addContextItem(iNum){
    oContext.oChatSet.add(iNum);
}

function removeContextItem(iNum){
    oContext.oChatSet.delete(iNum);
}

////////////////////
// Start Express  //
////////////////////

app.listen(app.get('port'), function() {
  console.log('Our bot is running on port', app.get('port'))
});