#!/usr/bin/env python
import struct
import smbus
import sys
import time
import json
import sched
import RPi.GPIO as GPIO

bus = smbus.SMBus(1) # 0 = /dev/i2c-0 (port I2C0), 1 = /dev/i2c-1 (port I2C1)
data = {}
s = sched.scheduler(time.time, time.sleep)
GPIO.setmode(GPIO.BCM)
GPIO.setup(6, GPIO.IN)

def readVoltage(bus):

     address = 0x36
     read = bus.read_word_data(address, 2)
     swapped = struct.unpack("<H", struct.pack(">H", read))[0]
     voltage = swapped * 1.25 /1000/16
     return voltage


def readCapacity(bus):

     address = 0x36
     read = bus.read_word_data(address, 4)
     swapped = struct.unpack("<H", struct.pack(">H", read))[0]
     capacity = swapped/256
     return capacity

def writeJSON():
    capacity = readCapacity(bus)
    voltage = readVoltage(bus)
    if GPIO.input(6):
        # Power Adapter plugged in
    	adapter = "in"
    else:
        # Power Adapter NOT plugged in
    	adapter = "out"
    data['percentage'] = []
    data['percentage'].append({
        'level': capacity,
        'voltage': voltage
    })
    data['adapter'] = []
    data['adapter'].append({
	'status': adapter
    })
    with open('/run/dump1090-mutability/battery.json', 'w') as outfile:
        json.dump(data, outfile)
while True:
	s.enterabs(10, 1, writeJSON, ())
	s.run()
