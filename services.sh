sudo python /usr/share/dump1090-mutability/html/python/battery.py & > /dev/null 2>&1 & 
sudo python /usr/share/dump1090-mutability/html/python/api.py & > /dev/null 2>&1 & 

export PORT=8080
sudo node /home/pi/cors-anywhere/server.js
sudo node /usr/share/dump1090-mutability/html/scripts/internet_data.js