import os

from flask import Flask, render_template, request, redirect, url_for
from flask_socketio import SocketIO, emit
from datetime import datetime

app = Flask(__name__)
# app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)

usernames = []
global user_id
user_id = 0

@app.route("/", methods=["GET", "POST"])
def index():
    if request.method == "POST":
        global user_id
        display_name = request.form["display"]
        user_id += 1
        usernames.append({
            "key": user_id,
            "display_name": display_name,
            "login_timestamp": datetime.now().strftime("%m/%d/%Y%H:%M:%S")
        })
        socketio.emit("user login", {"usernames": usernames, "display_name": display_name})
        return redirect(url_for('home'))
    return render_template("signin.html")

@app.route("/home")
def home():
    return render_template("home.html", usernames=usernames)

@app.route("/create-room")
def create_room():
    return render_template("createRoom.html")

@app.route("/room/<int:room_id>")
def room(room_id):
    return render_template("room.html", room_id=room_id)

if __name__ == "__main__":
    socketio.run(app)