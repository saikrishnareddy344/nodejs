const WebSocket = require('ws');

const client = new WebSocket('ws://localhost:8080');

let data = {
    login : true,
    userId : 1,
    message:"",
}

client.on('open', async () => {
  console.log('Connected to the WebSocket server.',JSON.stringify(data));
  client.send(JSON.stringify(data));
  let message = {
    sender:1,
    receiver:2,
    message:"hello sending to 2",
    messageStatus:true,
    }
    client.send(JSON.stringify(message))
  // You can add more messages or implement user input to send messages dynamically
});

client.on('message', (message) => {
  console.log('Received message from the server:',JSON.parse(message.toString()));
});

client.on('close', (code, reason) => {
  console.log(`Connection closed with code ${code} and reason "${reason}"`);
});
