import json
import os
import webbrowser
from functools import wraps


gui_dir = os.path.join(os.path.dirname(__file__), '..', '..' 'gui') # development path

if not os.path.exists(gui_dir): # frozen executable path
    gui_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'gui') 