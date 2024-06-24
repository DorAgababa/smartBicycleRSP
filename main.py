import signal
import asyncio
import websockets
import json
from gpiozero import Button

server_connection = None
socket_connected = False

# GPIO pin connected to the magnetic sensor that count number of rounds
MAGNETIC_SENSOR_PIN = 2
rounds = 0  # Describe the total rounds done till now
hold_flag = False  # Flag to indicate whether to count rounds or not

# Queues to communicate between threads
rounds_queue = asyncio.Queue()
message_queue = asyncio.Queue()

def intterupt_handler_magnetic_sensor(loop):
    global rounds
    global hold_flag
    if not hold_flag:
        rounds += 1
    print("rounds:", rounds)
    # Put the current rounds count in the queue
    asyncio.run_coroutine_threadsafe(rounds_queue.put(rounds),loop)

# Function to reset rounds count
def reset_rounds():
    global rounds
    global hold_flag
    hold_flag = False
    rounds = 0
    print("Rounds reset")

# Function to set hold flag
def set_hold_flag():
    global hold_flag
    hold_flag = True
    print("Hold flag set")

# Function to unset hold flag
def unset_hold_flag():
    global hold_flag
    hold_flag = False
    print("Hold flag unset")

# Function to send rounds count to client socket
async def send_rounds_count():
    global rounds, server_connection, socket_connected
    while True:
        rounds = await rounds_queue.get()
        if socket_connected and server_connection:
            try:
                await server_connection.send(json.dumps({"data": rounds}))
            except Exception as e:
                print("Error sending rounds count, socket reset/closed:", e)
                socket_connected = False
        else:
            print("waiting for app to be connected")

# Function to process incoming messages
async def process_message(message):
    message = message.strip()
    if message == "reset":
        reset_rounds()
    elif message == "hold":
        set_hold_flag()
    elif message == "release":
        unset_hold_flag()

# Function to handle client connections
async def handle_client(websocket, path):
    global socket_connected, server_connection
    server_connection = websocket
    socket_connected = True
    try:
        async for message in websocket:
            # Put the received message in the message queue
            asyncio.run_coroutine_threadsafe(message_queue.put(message), asyncio.get_event_loop())
    except websockets.ConnectionClosed:
        print("Connection closed")
    finally:
        socket_connected = False

# Function to process messages from the message queue
async def handle_messages():
    while True:
        message = await message_queue.get()
        await process_message(message)

# Function to nicely exit the program
def exit_program_gracefully():
    print("Exiting program...")
    exit(0)

def exit_program(signal, frame):
    exit_program_gracefully()

def setup_magnetic_sensor(loop):
    magnetic_sensor = Button(MAGNETIC_SENSOR_PIN)
    magnetic_sensor.when_pressed = intterupt_handler_magnetic_sensor
    magnetic_sensor.when_pressed = lambda: intterupt_handler_magnetic_sensor(loop)
    
    # Set up signal handler for program exit
    signal.signal(signal.SIGINT, exit_program)
    
    return magnetic_sensor

# Set up WebSocket server
async def start_server():
    print("listening to port 3000....")
    async with websockets.serve(handle_client, "localhost", 3000):
        await asyncio.Future()  # run forever

# Entry point
if __name__ == "__main__":
    # Set up signal handler for program exit
    signal.signal(signal.SIGINT, exit_program)

    
    # Create the asyncio event loop
    loop = asyncio.get_event_loop()

    # Set up magnetic sensor and attach it to the main loop
    magnetic_sensor = setup_magnetic_sensor(loop)

    # Start the WebSocket server in the asyncio loop, that will look for new connections
    loop.create_task(start_server())

    # Start the handle_messages function in the asyncio loop, one mission to wait for incoming messagea
    loop.create_task(handle_messages())

    # Start the send_rounds_count function in the asyncio loop, another task that will wait to outcoming messages to be created and send them
    loop.create_task(send_rounds_count())

    # Run the event loop
    loop.run_forever()
