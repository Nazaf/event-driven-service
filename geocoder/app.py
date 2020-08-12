from flask import Flask, request, jsonify
from geopy.geocoders import Nominatim
import pika

global answer

connection = pika.BlockingConnection(pika.ConnectionParameters(host='localhost', port=5672))

channel = connection.channel()

app = Flask(__name__)

geolocator = Nominatim(user_agent="geocoder app")

def callback(ch, method, properties, body):
    print(" [x] Received %r" % body)

@app.route("/")
def hello():
    return "Hello world"

@app.route("/coordinates", methods=['GET', 'POST'])
def get_coordinates():
    channel.basic_consume(
        queue='hello', on_message_callback=callback, auto_ack=True)
    if request.method  == 'POST':
        address = request.form['address']
        location = geolocator.geocode(address)
    return jsonify(location.latitude, location.longitude)

def receive():
    parameters = pika.ConnectionParameters('localhost')
    connection = pika.BlockingConnection(parameters)
    channel = connection.channel()
    channel.queue_declare(queue='toM')
    method_frame, header_frame, body = channel.basic_get(queue = 'toM')        
    if method_frame is None:
        connection.close()
        return ''
    else:            
        channel.basic_ack(delivery_tag=method_frame.delivery_tag)
        connection.close() 
        print(body)
        return body



if __name__ == '__main__':
    receive()
    app.run(host='0.0.0.0')