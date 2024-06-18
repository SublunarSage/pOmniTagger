from flask import Flask, render_template


flask_app = Flask(__name__)

@flask_app.route('/')
def home():
    return render_template('index.html')
    #return render_template('image_gallery_list.html')