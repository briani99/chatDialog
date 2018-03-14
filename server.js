
var express = require('express');
var bodyParser = require('body-parser');

// Instantiate Recast.AI SDK
var recastai = require('recastai').default;
var request = new recastai.request('c641415f3c9e0ac7eb10b0d34a79dc5a');



// Start Express server
var app = express();
app.set('port', process.env.PORT || 4000);
app.use(bodyParser.json());

// Handle / route
app.use('/chat', function(req, res) {
  
  var text = req.body.content;
  var myresponse = {};
  console.log("Analyzing - " + text);
  
  request.analyseText(text)
  
    .then(function(nlp) {

      var intent = nlp.intent();

      if (intent && intent.slug === 'greetings' && intent.confidence > 0.7) {
        // Do your code
        myresponse.content = "well hello ....";
        console.log("well hello ....");
        res.send(myresponse);

      } else {
        myresponse.content = "why dont you say hello... i only do greetings";
        console.log("why dont you say hello... i only do greetings");
        res.send(myresponse);
      }
    })
    .catch(function(e){
      res.send(e);
    });
});

// Run Express server, on right port
app.listen(app.get('port'), () => {
  console.log('Our bot is running on port', app.get('port'))
});