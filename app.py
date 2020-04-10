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

user_dict = {}
usernames = []

global user_id
user_id = 0

@app.route("/", methods=["GET", "POST"])
def index():
    if request.method == "POST":
        global user_id
        display_name = request.form["display"]
        user_id += 1
        user_dict[user_id] = {
            "display_name": display_name,
            "login_timestamp": datetime.now().strftime("%m/%d/%Y%H:%M:%S")
        }
        usernames = [user_dict[key]["display_name"] for key in user_dict.keys()]
        socketio.emit("user login", {"usernames": usernames, "user_id": user_id})
        session["isAuthenticated"] = True
        return redirect(url_for('home'))
    return render_template("signin.html")

@app.route("/home")
def home():
    if session.get("isAuthenticated"):
        usernames = [user_dict[key]["display_name"] for key in user_dict.keys()]
        return render_template("home.html", usernames=usernames)
    return redirect(url_for('index')) 

@app.route("/create-room")
def create_room():
    if session.get("isAuthenticated"):
        return render_template("createRoom.html")
    return redirect(url_for('index')) 

@app.route("/room/<int:room_id>")
def room(room_id):
    if session.get("isAuthenticated"):
        return render_template("room.html", room_id=room_id)
    return redirect(url_for('index')) 

@socketio.on("No user id")
def handleNotSignedIn():
    # session["isAuthenticated"] = False
    pass

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

if __name__ == "__main__":
    socketio.run(app)