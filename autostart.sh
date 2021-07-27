# All Scripts to be run at start
unclutter &
cd /usr/share/dump1090-mutability/html
sudo python battery.py &
sudo python api.py &
sudo node /scripts/internet_data.js