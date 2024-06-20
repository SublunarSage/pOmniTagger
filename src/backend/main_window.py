import webview
import threading
import logging

import flask_server

logger = logging.getLogger(__name__)


def start_flask():
    # Start the Flask server
    flask_server.flask_server.run(debug=True, port=8050, use_reloader=False)

def destroy_window(window):
    # Destroy the window
    window.destroy()

def open_file_dialog(window):
    file_types = ('Image Files (*.bmp;*.jpg;*.gif)', 'All files (*.*)')

    result = window.create_file_dialog(
        webview.FOLDER_DIALOG, allow_multiple=True, file_types=file_types
    )
    print(result)

def get_token():
    return webview.token

if __name__ == '__main__':
    # Start Dash in a separate thread
    #t = threading.Thread(target=start_dash)
    t = threading.Thread(target=start_flask)
    t.daemon = True
    t.start()

    # Create a Pywebview window
    primary_window = webview.create_window(
        'Flask with Pywebview', 'http://localhost:8050', min_size=(1280,800), 
        frameless=False, easy_drag=False, resizable=True
        )
    
    
    webview.start(gui='qt')
    
   
