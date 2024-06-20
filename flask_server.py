from flask import Flask, render_template, jsonify, request
import main_window


flask_server = Flask(__name__)

print("Token: ", main_window.get_token())



@flask_server.route('/')
def index():
    return render_template('index.html')
    #return render_template('image_gallery_list.html')

@flask_server.route('/image_input_processing')
def image_input_processing():
    return render_template('image_input_processing.html')

@flask_server.route("/extras")
def extras():
    return render_template('extras.html')


