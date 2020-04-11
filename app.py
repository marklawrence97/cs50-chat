import os

from flask import Flask, render_template, request, redirect, url_for, session
from flask_socketio import SocketIO, emit
from flask_session import Session
from datetime import datetime

app = Flask(__name__)

app.config["SESSION_TYPE"] = "filesystem"
Session(app)

app.config["SECRET_KEY"] = "SECRET"
socketio = SocketIO(app, manage_session=False)

global user_id
global user_dict
global room_id
global channel_dict

user_dict = {}
channel_dict = {}
channel_names = []
usernames = []
user_id = 0
room_id = 999

@app.route("/", methods=["GET", "POST"])
def index():
    if request.method == "POST":
        global user_id
        display_name = request.form["display"].strip()
        user_id += 1
        user_dict[user_id] = {
            "display_name": display_name,
            "login_timestamp": datetime.now().strftime("%m/%d/%Y%H:%M:%S")
        }
        usernames = [user_dict[key]["display_name"] for key in user_dict.keys()]
        socketio.emit("user login", {"usernames": usernames, "user_id": user_id})
        session["isAuthenticated"] = True
        session["userID"] = user_id
        return redirect(url_for('home'))
    return render_template("signin.html")

@app.route("/home")
def home():
    if session.get("isAuthenticated"):
        usernames = [user_dict[key]["display_name"] for key in user_dict.keys()]
        try:
            channel_names = [
                {
                "name": channel_dict[key]["room_name"], 
                "password": channel_dict[key]["password"],
                "room_id": key
                } for key in channel_dict]
        except KeyError:
            channel_names = []
        return render_template("home.html", usernames=usernames, channel_names=channel_names)
    return redirect(url_for('index')) 

@app.route("/create-room", methods=["GET", "POST"])
def create_room():
    if session.get("isAuthenticated"):
        if request.method == "POST":
            global room_id
            room_name = request.form["room"]
            room_id += 1
            try:
                password = request.form["password"]
            except:
                password = False
            participants = 1
            channel_dict[room_id] = {
                "room_name": room_name,
                "password": password,
                "participants": participants,
                "messages": [{
                    "user_id": 0,
                    "user_name": "cs50 Chat",
                    "message": "Welcome to cs50 Chat! "
                }]
            }
            return redirect(url_for('room', room_id=room_id))
        return render_template("createRoom.html")
    return redirect(url_for('index')) 

@app.route("/room/<int:room_id>")
def room(room_id):
    if session.get("isAuthenticated"):
        userID = session.get("userID")
        username = user_dict[userID]["display_name"]
        return render_template("room.html", room_info=channel_dict[room_id], userID=userID, username=username)
    return redirect(url_for('index')) 

@app.route("/sign_out", methods=["POST"])
def signOut():
    socketio.emit("sign out")
    user_id = request.headers.get("userID")
    try:
        user_dict.pop(user_id)
    except:
        pass
    session["isAuthenticated"] = False
    return redirect(url_for("index"))

@socketio.on("message sent")
def message_sent(data):
    channel_dict[int(data['room'])]['messages'].append({
        "user_id": int(data['userID']),
        "user_name": data['username'],
        "message": data['message']
    })
    print(channel_dict)

if __name__ == "__main__":
    socketio.run(app)