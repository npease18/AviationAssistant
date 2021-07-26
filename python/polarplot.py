import matplotlib.pyplot as plt
from mpl_toolkits.basemap import Basemap
import csv

m = Basemap(projection='mill',
            llcrnrlat = 25,
            llcrnrlon = -130,
            urcrnrlat = 50,
            urcrnrlon = -60,
            resolution='l')

m.drawcoastlines()
m.drawcountries(linewidth=2)
m.drawstates(color='b')


latitude = []
longitude = []
with open('AllPositions.csv', newline='') as csvfile:
    spamreader = csv.DictReader(csvfile, delimiter=',', quotechar='"')
    for row in spamreader:
        xlat, ylong = m(float(row['Longitude']), float(row['Latitude']))
        m.plot(xlat, ylong, '.', markersize=1)


homelat, homelong = 44.845, -69.344
homexpt, homeypt = m(homelong, homelat)
m.plot(homexpt, homeypt, 'c*', markersize=1)

plt.show()