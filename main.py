import time
import signal
import threading
from gpiozero import Button


# GPIO pin connected to the magnetic sensor that count number of rounds
MAGNETIC_SENSOR_PIN = 2
rounds = 0 #describe the total rounds done till now
roundsSec = 0 #use for describe the rounds for the last second
radius = 0.25
# Create a lock for synchronization the rounds_sec_lock variable
rounds_sec_lock = threading.Lock()

#calling itself each second
def update_rounds_sec():
    global roundsSec
    #update the gui with the current value
    print("rounds for last sec:" ,roundsSec)
    with rounds_sec_lock:
        roundsSec = 0
    timer = threading.Timer(1, update_rounds_sec)
    timer.daemon = True # make the thread terminated on the end of the main
    timer.start()
        
    
def intterupt_handler_magnetic_sensor():
    global rounds
    global roundsSec
    rounds += 1
    with rounds_sec_lock:
        roundsSec += 1
    print("rounds:" ,rounds)
    print("rounds for last sec:" ,roundsSec)

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

def main():
    startTime=time.time()
    update_rounds_sec()
    time.sleep(100)
    exit_program_gracefully()
# Entry point
if __name__ == "__main__":
    main()