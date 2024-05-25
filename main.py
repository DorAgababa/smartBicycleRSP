import signal
import socket
import threading
import time
from gpiozero import Button
server_connection = None
socket_connected = False

# GPIO pin connected to the magnetic sensor that count number of rounds
MAGNETIC_SENSOR_PIN = 2
rounds = 0  # describe the total rounds done till now
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
    send_rounds_count()

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
def send_rounds_count():
    global rounds,server_connection,socket_connected
    if socket_connected and server_connection:
        try:
            server_connection.sendall(bytes(str(rounds), 'utf-8'))
        except Exception as e:
            print("Error sending rounds count,socket reset/closed:", e)
            socket_connected = False
    else:
        print("waiting for app to be connected")


# Function to handle client connections, when connection is done , recv will raise an exception that will end this function that will end this thread
def handle_client(conn, addr):
    global socket_connected
    with conn:
        print('Connected by', addr)
        while True:
            try:
                data = conn.recv(1024)
                if not data:
                    break
                message = data.decode('utf-8').strip()
                if message == "reset":
                    reset_rounds()
                elif message == "hold":
                    set_hold_flag()
                elif message == "release":
                    unset_hold_flag()
            except ConnectionResetError:
                print("Connection with", addr, "was reset.")
                socket_connected = False
                break
            except Exception as e:
                print("failed to recieve data, due to:", e)
                socket_connected = False
                break

# Function to nicely exit the program
def exit_program_gracefully():
    print("Exiting program...")
    magnetic_sensor.close()
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

# Set up socket server
def start_server():
    global socket_connected,server_connection
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as server_socket:
        server_socket.bind(('localhost', 3000))
        server_socket.listen()
        print("Server listening on port 3000...")
        while True:
            conn, addr = server_socket.accept()
            server_connection = conn
            socket_connected = True
            threading.Thread(target=handle_client, args=(server_connection, addr)).start()

# Entry point
if __name__ == "__main__":
    # Start the server in a separate thread
    server_thread = threading.Thread(target=start_server)
    server_thread.start()

    # Dummy infinite loop to keep the program alive
    while True:
        pass
