from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
# from flask_socketio import SocketIO

app = Flask(__name__)
# socketio = SocketIO(app)

# Allow requests from your React app's URL
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

app.config.from_object('app.config.Config')
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///site.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

from app import routes
