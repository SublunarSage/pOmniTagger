import os
import json

from functools import wraps

from flask import Flask, render_template, jsonify, request
import pomni_utils

import webview

gui_dir = os.path.join(os.path.dirname(__file__), '..', '..', 'gui') # development path

if not os.path.exists(gui_dir): # frozen executable path
    gui_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'gui') 

flask_server = Flask(__name__,static_folder=f"{gui_dir}/static", template_folder=f"{gui_dir}/templates")
flask_server.config['SEND_FILE_MAX_AGE_DEFAULT'] = 1 # disable caching


def verify_token(function):
    @wraps(function)
    def wrapper(*args, **kwargs):
        data = json.loads(request.data)
        token = webview.token
        if token == webview.token:
            return function(*args, **kwargs)
        else:
            raise Exception('Authentication error')
    
    return wrapper

@flask_server.after_request
def add_header(response):
    response.headers['Cache-Control'] = 'no-store'
    return response

@flask_server.route('/')
def index():
    tabs = [
        {"id": "image_input_processing", "title": "Image Input and Processing", "template": "image_input_processing.html"},
        {"id": "image_interrogation", "title": "Interrogation", "template": "image_interrogation.html"},
        {"id": "image_tagging", "title": "Tagging", "template": "image_tagging.html"},
        {"id": "extras", "title": "Extras", "template": "extras.html"},
    ]

    #return render_template('index.html', token=webview.token)
    return render_template('index.html', token=webview.token, tabs=tabs)

@flask_server.route('/image_input_processing')
def image_input_processing():
    return render_template('image_input_processing.html')

@flask_server.route("/extras")
def extras():
    return render_template('extras.html')


@flask_server.route('/choose/directory', methods=['POST'])
@verify_token
def choose_directory():
    """
    Invoke a folder selection dialog and return the selected directory.
    :return: The selected directory.
    """
    dirs = webview.windows[0].create_file_dialog(webview.FOLDER_DIALOG)
    if dirs and len(dirs) > 0:
        directory = dirs[0]
        if isinstance(directory, bytes):
            directory = directory.decode('utf-8')
        
        response = {'status': 'success', 'directory': directory}
    else:
        response = {'status': 'cancel'}
    return jsonify(response)