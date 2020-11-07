from flask import Flask, json, request
import os

app = Flask(__name__)

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
      os.system(json['command'])
      return "404 Good Request"


@app.after_request
def after_request(response):
  response.headers.add('Access-Control-Allow-Origin', '*')
  response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
  response.headers.add('Access-Control-Allow-Methods', 'POST')
  return response


if __name__ == '__main__':
    app.run()
