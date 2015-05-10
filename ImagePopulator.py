import requests
import argparse
import json
from xml.etree import ElementTree as ET
from requests_oauthlib import OAuth1

MAPS_URL = "http://maps.google.com/maps/api/geocode/xml?address="
FIVE_HPX_URL = "https://api.500px.com/v1/photos/search?term="
FIVE_PX_PARAMS = "&sort=votes_count&image_size=600&rpp=1&exclude=People%2C%20Nude"
pict_id = 0

# Parse arguments
parser = argparse.ArgumentParser(description='Process location text file')
parser.add_argument('--infile', nargs=1)
args = parser.parse_args()

# Read Text File
text_file_name = args.infile
text_file = open(text_file_name[0], 'r')
locations = text_file.readlines()

# Cycle through the locations an initiate a search for the lat-longs
for location in locations:
    location = location.replace(" ", "%20")
    search_url = MAPS_URL + location
    request = requests.get(search_url)
    xmlcontent = request.content
    latitude_element = ET.fromstring(xmlcontent).find('result/geometry/location/lat')
    longitude_element = ET.fromstring(xmlcontent).find('result/geometry/location/lng')
    latitude = latitude_element.text
    longitude = longitude_element.text
    print("latitude=" + latitude + " : " + "longitude=" + longitude)

    # post getting the lat long data let's create an OAuth token and query 500px
    auth = OAuth1(
        '5Ip2cOTWPkQ0rGFKopSBfJhbQAEYNkWXr9pr5c03', 'snK8A439VxP16dO09CuTl5RsX3CUQjUIWmEE1vKa')
    image_data = requests.get(FIVE_HPX_URL + location + FIVE_PX_PARAMS, auth=auth)
    image_metadata = image_data.content
    image_metadata = image_metadata.decode("utf-8")
    image_metadata_json = json.loads(image_metadata)
    image_url = image_metadata_json['photos'][0]['image_url']
    print("URL:" + image_url)
    pict_id = pict_id + 1
    data = {}
    data['id'] = pict_id
    data['name'] = location.replace("%20", " ")
    data['lat'] = latitude
    data['long'] = longitude
    data['url'] = image_url
    print("Output Object:")
    print(data)
    send_data = requests.post("http://192.168.25.88:8080/api/images", None, data)


