import webview
import webview.menu as wm
import threading
import dash_app  # Import the Dash app module
import flask_app

def start_dash():
    # Start the Dash server
    dash_app.app.run(debug=True, port=8050, use_reloader=False)

def start_flask():
    # Start the Flask server
    flask_app.flask_app.run(debug=True, port=8050, use_reloader=False)

def destroy_window(window):
    # Destroy the window
    window.destroy()

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
    
    

    webview.start(debug=True)
   
