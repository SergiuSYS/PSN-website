import socket
import json
import flask
import threading

app = flask.Flask(__name__)


recived_data = {
    "temperature": 0,
    "humidity": 0,
    "flood": 0,  
    "alerts":[],
    "messages":[]
}

commands_to_send = {
    "r": 0,
    "g": 0,
    "b": 0,
    "message":None
}

@app.route('/')
def home():
    return flask.render_template('index.html')

@app.route('/data')
def get_data():
    global recived_data
    return flask.jsonify(recived_data)

@app.route('/led', methods=['POST'])
def send_led_color():
    global commands_to_send
    data = flask.request.json
    commands_to_send['r'] = data['r']
    commands_to_send['g'] = data['g']
    commands_to_send['b'] = data['b']
    return "OK"

@app.route('/send-msg', methods=['POST'])
def send_message():
    global commands_to_send
    data = flask.request.json
    commands_to_send["message"] = data["message"]
    return "OK"

def server():
    global client
    server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    server.bind(('0.0.0.0', 9999))
    server.listen(1)

    while True:
        global recived_data
        client, addr = server.accept()
        raw_data = client.recv(1024).decode()
        data = json.loads(raw_data)

        recived_data['temperature'] = data['temperature']
        recived_data['humidity'] = data['humidity']
        recived_data['flood'] = data['flood'] 
        recived_data['messages'] = data['messages']
        recived_data['alerts'] = data['alerts']
        
        print(data['temperature'])

        client.send(json.dumps(commands_to_send).encode())
        commands_to_send["message"] = None
        client.close()

threading.Thread(target=server,daemon=True).start()

app.run(host="0.0.0.0", port=5000)