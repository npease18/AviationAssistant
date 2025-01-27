MODE=$1

if [ $MODE == "aircraft" ]
then
 echo "Aircraft"
 sudo systemctl enable dump1090-mutability
 sudo mv /home/pi/.config/Start_Aircraft.desktop /home/pi/.config/autostart/Start_Aircraft.desktop
 sudo mv /home/pi/.config/autostart/Start_Radio.desktop /home/pi/.config/Start_Radio.desktop
 sudo mv /home/pi/Desktop/.Files/*.desktop /home/pi/Desktop/
 env DISPLAY=:0.0 pcmanfm -w /usr/share/dump1090-mutability/html/images/logo.png
 sudo reboot
fi


if [ $MODE == "radio" ]
then
 echo "Radio"
 sudo systemctl enable dump1090-mutability
 sudo mv /home/pi/.config/Start_Radio.desktop /home/pi/.config/autostart/Start_Radio.desktop
 sudo mv /home/pi/.config/autostart/Start_Aircraft.desktop /home/pi/.config/Start_Aircraft.desktop
 env DISPLAY=:0.0 pcmanfm -w /usr/share/dump1090-mutability/html/images/psplogo.png
 sudo mv /home/pi/Desktop/*.desktop /home/pi/Desktop/.Files/
 sudo reboot
fi
