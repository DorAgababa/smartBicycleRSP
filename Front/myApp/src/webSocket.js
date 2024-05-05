// websocketModule.js
let ws;
let counter = 0;
let intervalId;

function connectWebSocket() {
  ws = new WebSocket('ws://localhost:3000');

  ws.onopen = () => {
    console.log('Connected to server');
    startSendingData();
  };

  ws.onmessage = event => {
    const jsonData = JSON.parse(event.data);
    counter = jsonData.data;
    console.log('Counter Value:', counter);
  };

  ws.onclose = () => {
    console.log('Connection closed');
    clearInterval(intervalId);
  };

  ws.onerror = error => {
    console.error('WebSocket error:', error);
  };
}

function startSendingData() {
  intervalId = setInterval(() => {
    counter++;
    const data = { data: counter };
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(data));
    }
  }, 1000);
}

function resetCounter() {
  counter = 0;
  const data = { data: counter, reset: true }; // Include a flag to indicate reset
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(data)); // Send reset message to the server
  }
}

export { connectWebSocket, resetCounter };
