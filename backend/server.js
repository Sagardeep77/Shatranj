//term used  Connections = Players 
  //          list = linkedList
  //          P2P = peer to peer


const P2PConnectionModel = require("./P2PConnection.model.js");
const ConnectionsModel = require("./Connections.model.js");
var connections = new ConnectionsModel();

let app = require('express')();
let http = require('http').Server(app);
bodyParser = require('body-parser');


let io = require("socket.io")(http, {
  handlePreflightRequest: (req, res) => {
    const headers = {
      "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept",
      "Access-Control-Allow-Origin": "http://localhost:4200", //or the specific origin you want to give access to,
      'Access-Control-Allow-Credentials': true
    };
    res.writeHead(200, headers);
    res.end();
  }
});

// connection with websocket

io.on('connection', (socket) => {

  console.log("user connected with "+socket.id );

  //if user disconnects

  socket.on('disconnect', function () {
    let response = connections.searchP2PConnection(socket.id);
    if(response){
      // console.log("Player " + response.player +" disconnected of P2PConection :",response.P2PConnection);
      response.P2PConnection.activeConnections--;
      // response.P2PConnection.playerLeft(parseInt(response.player));
      connections.usedCodes[response.P2PConnection.code]=false;
      console.log("reusable code ",response.P2PConnection.code);
      return null; 
    }
    console.log("Not connected with any P2PConnection");
  });

  
  //event emit-code starts

  socket.on('emit-code', (data) => {
    
    let response = connections.establishP2PConnection(socket,parseInt(data.code));
    let status;
    
    if (response.activeConnections == 1) {
      connections.setCodeUsed(parseInt(data.code));
      status = "active";
    }
    else if(response.activeConnections == 2){
      connections.setCodeUsed(parseInt(data.code));
      status = "active";
      response.P2PConnection.enableEventSharing();
    }
    else{
      status = "not-active";
    }
    io.emit('on-connect', {
      "Code": data.code,
      "activePlayers": response.activeConnections,
      "status": status
    });
  });

  //even emit-code ends

  // socket.on('new-message', (message) => {
  //   console.log(message);
  //   // io.emit('message', {type:'new-message', text: message});   
  //   io.emit('new-message', "server->client");
  // });

});


//middlewares for http requests

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", req.headers.origin);
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header('Access-Control-Allow-Credentials', true);
  next();
});

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

//req for the code from the client side . It checks whether the code is already used or not

app.get('/', async function (req, res) {
  let code = req.query.code;
  console.log(code);
  if (connections.checkCodeUsed(code)) {
    res.send({
      "code": code,
      "status": "Used Code",
      "canUse": false
    });
  }
  else {
    res.send({
      "code": code,
      "status": "Unused Code",
      "canUse": true
    });
  }
})

//to listen on port 4000 
http.listen(4000, () => {
  console.log('started on port 4000');
});

