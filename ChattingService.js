const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });
const clientsDetails = {}
const clientUserId = {}
const offlineMessages = {}

wss.on('connection', (ws) => {

  ws.on('message', (message) => {
    console.log(message.toString())
    let decodedMessage = JSON.parse(message.toString())
    if (decodedMessage.login == true) {
        clientsDetails[`${decodedMessage.userId}`] = {
            "connection":ws,
            "loggedIn":Date.now(),
            "active":true,
        }
        let date = new Date(Date.now())
        console.log("logined now",date)

        if(offlineMessages[decodedMessage.userId] != undefined){
            ws.send(JSON.stringify(offlineMessages[decodedMessage.userId]))
        }

    } 

    else if(decodedMessage.messageStatus == true){
        let sender = decodedMessage.sender
        let receiver = decodedMessage.receiver
        let message = decodedMessage.message
        console.log("client object -- >>",clientsDetails)
        console.log("revived a message request",sender,receiver,message,clientsDetails[`${receiver}`])
        if (clientsDetails[`${receiver}`] == undefined){
            if (offlineMessages[`${receiver}`] ==undefined || offlineMessages[`${receiver}`][`${sender}`] == undefined) {
                offlineMessages[`${receiver}`] = {}
                offlineMessages[`${receiver}`][`${sender}`] = [message]
            }
            else{
                offlineMessages[`${recreceiverever}`][`${sender}`].push(message)
            }
        }
        else if(clientsDetails[`${receiver}`].active == true){
            let finalMessage = {"sender":sender,"message":message}
            clientsDetails[`${receiver}`].connection.send(JSON.stringify(finalMessage))
        }
    }
  });

  ws.on('close', () => {
    console.log("",ws)
    // clients.delete(client);
  });
});

const broadcastMessage = (room, message) => {
  clients.forEach((client) => {
    if (client.room === room && client.connection.readyState === WebSocket.OPEN) {
      client.connection.send(message);
    }
  });
};

console.log('WebSocket server is running on port 8080');
