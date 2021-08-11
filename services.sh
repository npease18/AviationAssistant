sudo python /usr/share/dump1090-mutability/html/python/battery.py & > /dev/null 2>&1 & 

export FLASKAPP="api.py"
cd /usr/share/dump1090-mutability/html/python/
sudo flask run -h 0.0.0.0  & > /dev/null 2>&1 & 
#sudo python /usr/share/dump1090-mutability/html/python/api.py & > /dev/null 2>&1 & 
sudo node /usr/share/dump1090-mutability/html/scripts/internet_data.js & > /usr/share/dump1090-mutability/html/scripts/log &

export PORT=8080
sudo node /home/pi/cors-anywhere/server.js