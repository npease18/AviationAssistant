from flask import Flask, json, request
import os
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

app = Flask(__name__)
def readVoltage(bus):

     address = 0x36
     read = bus.read_word_data(address, 2)
     swapped = struct.unpack("<H", struct.pack(">H", read))[0]
     voltage = swapped * 1.25 /1000/16
     print(voltage)
     return voltage


def readCapacity(bus):

     address = 0x36
     read = bus.read_word_data(address, 4)
     swapped = struct.unpack("<H", struct.pack(">H", read))[0]
     capacity = swapped/256
     print(capacity)
     return capacity

@app.route('/battery',methods = ['POST','GET'])
def battery():
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
    print("HERE")
    data['adapter'] = []
    data['adapter'].append({
	  'status': adapter
    })
    return data

@app.route('/brightness',methods = ['POST'])
def brightness():
   if request.method == 'POST':
      json = request.get_json()
      if json['level'] < 255 and json['level'] > 15:
        status = os.popen('echo '+str(json['level'])+' > /sys/class/backlight/rpi_backlight/brightness').read()
      elif json['level'] == 256:
        status = os.popen('sudo cat /sys/class/backlight/rpi_backlight/brightness').read()
      return status


@app.route('/audio',methods = ['POST'])
def volume():
   if request.method == 'POST':
      json = request.get_json()
      if json['direction']:
    	  level = os.popen('vol +').read()
      elif json['direction'] == 0:
        level = os.popen('vol -').read()
      elif json['direction'] == 2:
        level = os.popen('vol').read()
      return str(level)

@app.route('/cmd',methods = ['POST'])
def command():
   if request.method == 'POST':
      json = request.get_json()
      output = os.popen("cd /usr/share/dump1090-mutability/html && "+json['command']).read()
      #output = os.popen(json['command']).read()
      return str(output)


@app.after_request
def after_request(response):
  response.headers.add('Access-Control-Allow-Origin', '*')
  response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
  response.headers.add('Access-Control-Allow-Methods', 'POST')
  return response


if __name__ == '__main__':
    app.run()


