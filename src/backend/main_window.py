import webview
import threading
import logging
import sys

import flask_server
from qtpy.QtWidgets import QApplication
from qtpy.QtCore import QEvent
import webview.platforms.qt

logger = logging.getLogger(__name__)


def start_flask():
    # Start the Flask server
    flask_server.flask_server.run(debug=True, port=8050, use_reloader=False)

def destroy_window(window):
    # Destroy the window
    window.destroy()

def open_file_dialog(window):
    result = window.create_file_dialog(
        webview.FOLDER_DIALOG, allow_multiple=True,
    )
    print(result)

def get_token():
    return webview.token

class MainWindow(QApplication):
    def event(self, event: QEvent):
        if event.type() == QEvent.Type.ApplicationActivate:
            window.set_title("pOmniTagger")
        if event.type() == QEvent.Type.ApplicationDeactivate:
            window.set_title("pomnitagger")
        return super(QApplication, self).event(event)


if __name__ == '__main__':
    # Start Dash in a separate thread
    #t = threading.Thread(target=start_dash)
    t = threading.Thread(target=start_flask)
    t.daemon = True
    t.start()

    app = MainWindow(sys.argv)
    # Create a Pywebview window
    window = webview.create_window(
        'Flask with Pywebview', 'http://localhost:8050', min_size=(1280,800), 
        frameless=False, easy_drag=False, resizable=True
        )
    
    
    webview.start(gui='qt', debug=True)
    
   
