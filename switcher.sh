MODE=$1

if [ $MODE == "aircraft" ]
then
 echo "Aircraft"
 sudo systemctl enable dump1090-mutability
 sudo mv /home/pi/.config/Start_Aircraft.desktop /home/pi/.config/autostart/Start_Aircraft.desktop
 sudo mv /home/pi/.config/autostart/Start_Radio.desktop /home/pi/.config/Start_Radio.desktop
 sudo pcmanfm --set-wallpaper /usr/share/dump1090-mutability/html/images/logo.png
 sudo reboot
fi


if [ $MODE == "radio" ]
then
 echo "Radio"
 sudo systemctl enable dump1090-mutability
 sudo mv /home/pi/.config/Start_Radio.desktop /home/pi/.config/autostart/Start_Radio.desktop
 sudo mv /home/pi/.config/autostart/Start_Aircraft.desktop /home/pi/.config/Start_Aircraft.desktop
 sudo pcmanfm --set-wallpaper /usr/share/dump1090-mutability/html/images/psplogo.png
 sudo reboot
fi