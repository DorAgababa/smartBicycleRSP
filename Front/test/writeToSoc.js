const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 3000 });

let counter = 0; // Move counter variable declaration outside of the connection handler

wss.on('connection', ws => {
  console.log('Client connected');
  counter = 0
  const interval = setInterval(() => {
    counter++;
    const data = { data: counter };
    try {
      ws.send(JSON.stringify(data));
    } catch (error) {
      console.error('Error sending data to client:', error.message);
      clearInterval(interval); // Stop the interval if there's an error
    }
  }, 1000);

  ws.on('message', message => {
    try {
      const parsedMessage = JSON.parse(message);
      if (parsedMessage.reset) {
        console.log('Received reset message from client');
        counter = 0; // Reset the counter
        broadcastCounter(counter); // Notify all clients about the counter reset
      }
    } catch (error) {
      console.error('Error parsing message from client:', error.message);
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected');
    clearInterval(interval);
  });
});

function broadcastCounter(counterValue) {
  const data = { data: counterValue };
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
}

console.log('Server running on port 3000');
