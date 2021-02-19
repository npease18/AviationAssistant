sudo python /usr/share/dump1090-mutability/html/python/battery.py & > /dev/null 2>&1 & 
sudo python /usr/share/dump1090-mutability/html/python/api.py & > /dev/null 2>&1 & 

export PORT=6000
sudo node /home/pi/cors-anywhere/server.js