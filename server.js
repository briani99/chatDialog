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

    var sIntent = firstEntityValue(data.entities, "intent");
    var sRelease = firstEntityValue(data.entities, "release");
    var sProduct = firstEntityValue(data.entities, "product");
    var sGreeting = firstEntityValue(data.entities, "greetings");

    if(sIntent && sIntent === "innovation"){
        addContextItem(INTENT_INOVATION);
    }
    if(sRelease && sRelease === "current release"){
        addContextItem(RELEASE_CURRENT);
    }else if (sRelease){
        addContextItem(RELEASE_ALL);
    }
    if(sProduct && sProduct === "Success Factors"){
        addContextItem(PRODUCT_SF)
    }else if (sProduct){
        addContextItem(PRODUCT_ALL);
    }
    if(sGreeting && sGreeting === "true" ){
        addContextItem(GREETING)
    }

    var iContextValue;
    if(oContext.oChatSet && oContext.oChatSet.size > 0){
        var iContextValue = (Array.from(oContext.oChatSet)).reduce((a, b) => a + b);
    }else{
        iContextValue = 0;
    }


    switch (iContextValue) {
        case 0:
            oResponse.content = "I can help you find what you want,  what would you like to see";
            break;
        case INTENT_INOVATION:
            oResponse.content = "Can you tell me for what releases?";
            break;
        case INTENT_INOVATION + RELEASE_CURRENT:
            oResponse.content = "Ok for the current release, Do you what to filter by product also?";
            break;
        case INTENT_INOVATION + RELEASE_PREVIOUS:
            oResponse.content = "Ok for the previous release, Do you what to tell me what product?";
            break;
        case INTENT_INOVATION + PRODUCT_ALL:
            oResponse.content = "Ok All products, but for what release?";
            break;
        case INTENT_INOVATION + PRODUCT_SF:
            oResponse.content = "Ok for success factors, Do you what to tell me what release?";
            break;
        case INTENT_INOVATION + RELEASE_CURRENT + PRODUCT_ALL:
            oResponse.content = "Ok, I can filter the current release for all products";
            oResponse.navTo = "#/PRODUCT/100/REL/Q2";
            break;
        case INTENT_INOVATION + RELEASE_CURRENT + PRODUCT_SF:
            oResponse.content = "Ok, I can filter the current release for successfactors";
            oResponse.navTo = "#/PRODUCT/100/REL/Q2";
            break;
        case INTENT_INOVATION + RELEASE_ALL + PRODUCT_ALL:
            oResponse.content = "Ok, I can filter all releases for all products";
            oResponse.navTo = "#/PRODUCT/100/REL/Q2";
            break;
        case INTENT_INOVATION + RELEASE_ALL + PRODUCT_SF:
            oResponse.content = "Ok, I can filter all releases for successfactors";
            oResponse.navTo = "#/PRODUCT/100/REL/Q2";
            break;
        case GREETING:
            removeContextItem(GREETING);
            oResponse.content = "Hello, how can I help?";
            break;
        default: 
            oResponse.content  = "lets start again,  I can help filter the CAA, just tell me what you would like to see";

    }

    res.send(oResponse);
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