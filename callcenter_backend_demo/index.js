var express = require('express')
var bodyParser = require('body-parser');
var app = express()
const uuidv1 = require('uuid/v1');
app.use(bodyParser.json());

var callConferenceMap = [];

//callConferenceMap.push({callId: 'xyz callId 1', confId: 'abc confId 1', timestamp: 0})
//callConferenceMap.push({callId: 'xyz callId 2', confId: 'abc confId 2', timestamp: 10000})

// sets port 8080 to default or unless otherwise specified in the environment
app.set('port', process.env.PORT || 8080);

app.use(function(req, res, next) { // Enable CORS
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

app.get('/availableCalls', (req, res) => {
    var response = callConferenceMap
    //console.log('Got request for conference list');
    res.json(response)
})

app.post('/', (req, res) => {
    var request = req.body;
    console.log('Got event', request);

    switch (request.event) {
        case 'ice':
            var response = {};

            if(request.to.type == "did") { // Process call made to call center number
                var confId = uuidv1()
                callConferenceMap.push({
                    callId: request.callid,
                    confId: confId,
                    fromCli: request.cli,
                    timestamp: Date.now()
                })
                //callConferenceMap[request.callid] = confId
    
                response = {
                    "action": {
                        "name": "connectConf",
                        "conferenceId": confId,
                        "cli": request.cli
                    }
                }
            }
            //else if(request.to.type == "conference") { // Process call made to conference
            else if(request.originationType == "MXP") { // Process call made to conference
                response = {
                    "action": {
                        "name": "connectConf",
                        "conferenceId": callConferenceMap[0].confId
                        //"conferenceId": request.to.endpoint
                    }
                }
            }
            
            console.log('Incoming ICE will respond', response)
            res.send(response)

            break;
        
       case 'dice':
            callConferenceMap = callConferenceMap.filter(e => e.callId != request.callid)
        
            var response = {}

            console.log('Incoming DICE will respond', response)
            res.send(response)
            break;
        
        default:
            console.log('Event not supported', request.event)

            var response = {}
            res.send(response)
    }

    console.log('Conference map is now', callConferenceMap)
})


app.listen(app.get('port'))
console.log('Listening on port', app.get('port'))