sudo python /usr/share/dump1090-mutability/html/python/battery.py & > /dev/null 2>&1 & 
sudo python /usr/share/dump1090-mutability/html/python/api.py & > /dev/null 2>&1 & 
sudo node /usr/share/dump1090-mutability/html/scripts/internet_data.js & > /dev/null 2>&1 &
/usr/bin/wget https://server1.nicholaspease.com/reports/liveatc.json -O /home/pi/dump1090-info/liveatc.json

export PORT=8080
sudo node /home/pi/cors-anywhere/server.js