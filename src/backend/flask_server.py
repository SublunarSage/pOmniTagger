import os
import json
import mimetypes

from functools import wraps

from flask import Flask, render_template, jsonify, request, send_file
import pomni_utils
from pomni_config import BATCH_SIZE, FILE_EXTENSIONS

import webview

gui_dir = os.path.join(os.path.dirname(__file__), '..', '..', 'gui') # development path

if not os.path.exists(gui_dir): # frozen executable path
    gui_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'gui') 

flask_server = Flask(__name__,static_folder=f"{gui_dir}/static", template_folder=f"{gui_dir}/templates")
flask_server.config['SEND_FILE_MAX_AGE_DEFAULT'] = 1 # disable caching

file_lists = {}

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
        {"id": "image_input_processing", "title": "Image Input and Processing", 
            "template": "image_input_processing.html"},
        {"id": "image_interrogation", "title": "Interrogation", 
            "template": "image_interrogation.html"},
        {"id": "image_tagging", "title": "Tagging", 
            "template": "image_tagging.html"},
        {"id": "extras", "title": "Extras", 
            "template": "extras.html"},
    ]

    #return render_template('index.html', token=webview.token)
    return render_template('index.html', token=webview.token, tabs=tabs)


# TODO: Figure out how to split this into separate files

@flask_server.route('/choose/directory', methods=['POST'])
@verify_token
def choose_directory():
    """
    Invoke a folder selection dialog and return the selected directory,
    along with a list of image and txt file paths within it.
    :return: The selected directory and a list of file paths.
    """

    default_extensions = {'.jpg', '.jpeg', '.png', '.gif', '.txt'}

    dirs = webview.windows[0].create_file_dialog(webview.FOLDER_DIALOG)
    if dirs and len(dirs) > 0:
        directory = dirs[0]
        if isinstance(directory, bytes):
            directory = directory.decode('utf-8')
        
        file_list = []
        for root, dirs, files in os.walk(directory):
            for file in files:
                file_path = os.path.join(root, file)
                if os.path.splitext(file_path)[1].lower() in FILE_EXTENSIONS:
                    file_list.append(file_path)
        
        # Store the file list in memory
        file_lists[directory] = {
            'files': file_list,
            'current_index': 0
        }

        return jsonify({
                    'status': 'success',
                    'directory': directory,
                    'total_files': len(file_list),
                    'batch_size': BATCH_SIZE
                })
    else:
        return jsonify({'status': 'cancel'})

def has_caption_file(file_path):
    base_name = os.path.splitext(file_path)[0]
    caption_extensions = {'.txt', '.caption'}
    return any([os.path.exists(base_name + ext) for ext in caption_extensions])

@flask_server.route('/get_next_batch', methods=['POST'])
@verify_token
def get_next_batch():
    data = request.get_json()
    directory = data.get('directory')

    if directory not in file_lists:
        return jsonify({
            'status': 'error',
            'message': 'Directory not found'
        })

    file_data = file_lists[directory]
    current_index = file_data['current_index']
    file_list = file_data['files']

    if current_index >= len(file_list):
        return jsonify({
            'status': 'success',
            'files': [],
            'has_more': False
        })

    end_index = min(current_index + BATCH_SIZE, len(file_list))
    
    batch = [
        {
            'path': file_path,
            'hasCaptionFile': has_caption_file(file_path)
        }
        for file_path in file_list[current_index:end_index]
    ]

    file_data['current_index'] = end_index

    return jsonify({
        'status': 'success',
        'files': batch,
        'has_more': end_index < len(file_list)
    })
    

@flask_server.route('/image/<path:filename>')
def serve_image(filename):
    # Get the file extension
    _, ext = os.path.splitext(filename)
    ext = ext.lower()
    
    # Determine the MIME type
    mime_type = FILE_EXTENSIONS.get(ext)
    
    # If we couldn't determine the MIME type, use mimetypes as a fallback
    if mime_type is None:
        mime_type, _ = mimetypes.guess_type(filename)
    
    # If still None, default to 'application/octet-stream'
    if mime_type is None:
        mime_type = 'application/octet-stream'

    return send_file(filename, mimetype=mime_type)