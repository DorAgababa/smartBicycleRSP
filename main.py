import signal
import asyncio
import websopckets
import json
import threading
from gpiozero import Button


server_connection = None
socket_connected = False

# GPIO pin connected to the magnetic sensor that count number of rounds
MAGNETIC_SENSOR_PIN = 2
rounds = 0  # Describe the total rounds done till now
hold_flag = False  # Flag to indicate whether to count rounds or not
lock = threading.Lock()  # Lock for synchronization

def intterupt_handler_magnetic_sensor():
    global rounds
    global hold_flag
    with lock:
        if not hold_flag:
            rounds += 1
    print("rounds:", rounds)
    # Send the current rounds count to the client socket
    asyncio.run_coroutine_threadsafe(send_rounds_count(), asyncio.get_event_loop())

# Function to reset rounds count
def reset_rounds():
    global rounds
    with lock:
        rounds = 0
    print("Rounds reset")

# Function to set hold flag
def set_hold_flag():
    global hold_flag
    with lock:
        hold_flag = True
    print("Hold flag set")

# Function to unset hold flag
def unset_hold_flag():
    global hold_flag
    with lock:
        hold_flag = False
    print("Hold flag unset")

# Function to send rounds count to client socket
async def send_rounds_count():
    global rounds, server_connection, socket_connected
    if socket_connected and server_connection:
        try:
            await server_connection.send(json.dumps({"data": rounds}))
        except Exception as e:
            print("Error sending rounds count, socket reset/closed:", e)
            socket_connected = False
    else:
        print("waiting for app to be connected")

# Function to handle client connections
async def handle_client(websocket, path):
    global socket_connected, server_connection
    server_connection = websocket
    socket_connected = True
    try:
        async for message in websocket:
            message = message.strip()
            if message == "reset":
                reset_rounds()
            elif message == "hold":
                set_hold_flag()
            elif message == "release":
                unset_hold_flag()
    except websockets.ConnectionClosed:
        print("Connection closed")
    finally:
        socket_connected = False

# Function to nicely exit the program
def exit_program_gracefully():
    print("Exiting program...")
    exit(0)

def exit_program(signal, frame):
    exit_program_gracefully()

def setup_magnetic_sensor():
    magnetic_sensor = Button(MAGNETIC_SENSOR_PIN)
    magnetic_sensor.when_pressed = intterupt_handler_magnetic_sensor
    
    # Set up signal handler for program exit
    signal.signal(signal.SIGINT, exit_program)
    
    return magnetic_sensor

# Set up magnetic sensor
magnetic_sensor = setup_magnetic_sensor()

# Set up WebSocket server
async def start_server():
    print("Server listening on port 3000...")
    async with websockets.serve(handle_client, "localhost", 3000):
        await asyncio.Future()  # run forever

# Entry point
if __name__ == "__main__":
    # Set up signal handler for program exit
    signal.signal(signal.SIGINT, exit_program)

    # Create the asyncio event loop
    loop = asyncio.get_event_loop()

    # Start the WebSocket server in the asyncio loop
    loop.create_task(start_server())

    

    # Run the event loop
    loop.run_forever()
