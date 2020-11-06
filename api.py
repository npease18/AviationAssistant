from flask import Flask, json, request
import os

app = Flask(__name__)

@app.route('/audio',methods = ['POST'])
def login():
   if request.method == 'POST':
      json = request.get_json()
      if json['direction']:
          print("up")
          level = os.system("vol +")
      return level

@app.after_request
def after_request(response):
  response.headers.add('Access-Control-Allow-Origin', '*')
  response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
  response.headers.add('Access-Control-Allow-Methods', 'POST')
  return response


if __name__ == '__main__':
    app.run()