function connectWebSocket() {
  let socket = new WebSocket("ws://localhost:3000");

  socket.onopen = function(event) {
      console.log("WebSocket is open now.");
  };

  socket.onmessage = function(event) {
      try {
          const messageObj = JSON.parse(event.data);
          const number = messageObj.data;  // Extract the number
          console.log('Server says: ' + number); // Or update the UI accordingly
      } catch (e) {
          console.error('Error parsing JSON:', e);
      }
  };

  socket.onclose = function(event) {
      console.log("WebSocket is closed now.");
  };

  socket.onerror = function(error) {
      console.error("WebSocket error: " + error);
  };

  return socket;
}

function resetCounter(socket) {
  if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send("reset");
      console.log("Socket reset")
  } else {
      console.log("WebSocket is not open.");
  }
}

function pauseCounter(socket) {
  if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send("hold");
      console.log("Socket paused")
  } else {
      console.log("WebSocket is not open.");
  }
}

function releaseCounter(socket) {
  if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send("release");
      console.log("Socket release")
  } else {
      console.log("WebSocket is not open.");
  }
}


export { connectWebSocket, resetCounter, pauseCounter, releaseCounter };
