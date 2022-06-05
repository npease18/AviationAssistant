sudo python /usr/share/dump1090-mutability/html/python/battery.py & > /dev/null 2>&1 & 
sudo python /usr/share/dump1090-mutability/html/python/api.py & > /dev/null 2>&1 & 
sudo node /usr/share/dump1090-mutability/html/scripts/internet_data.js & > /dev/null 2>&1 &

export PORT=8080
sudo node /home/pi/cors-anywhere/server.js

cd /home/pi/dump1090-info
wget http://server1.nicholaspease.com:6500/reports/liveatc.json