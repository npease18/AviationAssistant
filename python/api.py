from flask import Flask, json, request
import os

app = Flask(__name__)
name = "Aviation Assistant"
version = "v.2.7.2-aaf68f9bf2b51806300f7830f67f5254f04a90a2"

@app.route('/brightness',methods = ['POST'])
def brightness():
   if request.method == 'POST':
      json = request.get_json()
      if json['level'] < 255 and json['level'] > 15:
        status = os.popen('echo '+str(json['level'])+' > /sys/class/backlight/rpi_backlight/brightness').read()
      elif json['level'] == 256:
        status = os.popen('sudo cat /sys/class/backlight/rpi_backlight/brightness').read()
      return status

@app.route('/information',methods = ['GET'])
def information():
  ip = os.popen("ip -4 addr show wlan0 | grep -oP '(?<=inet\s)\d+(\.\d+){3}'").read()
  json = {
    "name": name,
    "version": version,
    "ip": ip
  }
  return json
   
@app.route('/connection',methods = ['GET'])
def connection():
   if request.method == 'GET':
      return "OK"

@app.route('/authentication',methods = ['POST'])
def authentication():
   json = request.get_json()
   if json['username'] == "npease" and json['password'] == "1118":
     return "OK"
   else:
     return "NO"

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

@app.route('/curl',methods = ['POST'])
def curl():
   if request.method == 'POST':
      json = request.get_json()
      output = os.popen("cd /usr/share/dump1090-mutability/html && curl "+json['url']).read()
      #output = os.popen(json['command']).read()
      return str(output)

@app.route('/cputemp',methods = ['GET'])
def cputemp():
   if request.method == 'GET':
      output = os.popen("vcgencmd measure_temp").read()
      return str(output)

@app.route('/update',methods = ['GET'])
def update():
   if request.method == 'GET':
      output = os.popen("sudo git pull").read()
      return str(output)

@app.route('/branch',methods = ['GET'])
def branch():
   if request.method == 'GET':
      output = os.popen("sudo git branch | grep -F '*'").read()
      return str(output)

@app.route('/shutdown',methods = ['GET'])
def shutdown():
   if request.method == 'GET':
      output = os.popen("cd /usr/local/bin && sudo x728softsd.sh").read()
      return str(output)


@app.route('/reboot',methods = ['GET'])
def reboot():
   if request.method == 'GET':
      output = os.popen("cd /usr/local/bin && sudo reboot").read()
      return str(output)

@app.route('/setbranch',methods = ['POST'])
def setbranch():
   if request.method == 'POST':
      json = request.get_json()
      output = os.popen("cd /usr/share/dump1090-mutability/html && sudo git checkout " +json['branch']).read()
      return str(output)


@app.after_request
def after_request(response):
  response.headers.add('Access-Control-Allow-Origin', '*')
  response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
  response.headers.add('Access-Control-Allow-Methods', 'POST')
  return response


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)