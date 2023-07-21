const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });
const clientsDetails = new Map();
const connectionToUserId = new Map();
const offlineMessages = {};

wss.on('connection', (ws) => {
  ws.on('message', (message) => {
    console.log(message.toString());
    let decodedMessage = JSON.parse(message.toString());
    if (decodedMessage.login === true) {
      clientsDetails.set(decodedMessage.userId, {
        connection: ws,
        loggedIn: Date.now(),
        active: true,
      });

      let date = new Date(Date.now());
      console.log("logined now", date);

      if (offlineMessages[decodedMessage.userId] !== undefined) {
        ws.send(JSON.stringify(offlineMessages[decodedMessage.userId]));
      }
      connectionToUserId.set(ws, decodedMessage.userId);
    } 
    
    else if (decodedMessage.messageStatus === true) {
      let sender = decodedMessage.sender;
      let receiver = decodedMessage.receiver;
      let message = decodedMessage.message;
      console.log("client object -- >>", clientsDetails);
      console.log(
        "received a message request",
        sender,
        receiver,
        message,
        clientsDetails.get(receiver)
      );

      if (clientsDetails.get(receiver) === undefined) {
        if (offlineMessages[receiver] === undefined || offlineMessages[receiver][sender] === undefined){
          offlineMessages[receiver] = {};
          offlineMessages[receiver][sender] = [message];
        } 
        else {
          offlineMessages[receiver][sender].push(message);
        }
      } 
      
      else if (clientsDetails.get(receiver).active === true) {
        let finalMessage = { sender: sender, message: message };
        clientsDetails.get(receiver).connection.send(JSON.stringify(finalMessage));
      }
    }
  });

  ws.on('close', () => {
    removeClient(ws);
  });
});

function removeClient(connection) {
  const userId = connectionToUserId.get(connection);
  if (userId) {
    clientsDetails.delete(userId);
    connectionToUserId.delete(connection);
  }
}

console.log('WebSocket server is running on port 8080');
