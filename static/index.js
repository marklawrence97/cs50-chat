document.addEventListener("DOMContentLoaded", () => {

    //If user is not signed in emit signal to redirect them to sign in page.
    socket.on('connect', () => {

        const userID = window.localStorage.getItem("userID");
        if (!userID) {
            socket.emit("No user id")
        }
    });

    socket.on('user login', data => {
        const usernames = data.usernames
        window.localStorage.setItem("userID", data.user_id)

        document.querySelector("#usernames").innerHTML = ""

        usernames.forEach(user => {
            displayUser(user)
        });
    });

    socket.on("sign out", () => {
        window.localStorage.removeItem("userID")
    });

    const messageForm = document.querySelector("#messageForm")

    messageForm.addEventListener("keyup", function(event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            document.getElementById("sendMessage").click();
        }
    })

    function displayUser(username) {
        const eventDiv = document.createElement("div");
        eventDiv.className = "event";
        
        const labelDiv = document.createElement("div");
        labelDiv.className = "label";

        const icon = document.createElement("i");
        icon.className = "user circle icon";
        icon.style.color = "white";

        const contentDiv = document.createElement("div");
        contentDiv.className = "content";
        contentDiv.style.marginLeft = "1%";

        const summaryDiv = document.createElement("div");
        summaryDiv.className = "summary";
        summaryDiv.style.color = "white";

        const user = document.createElement("p");
        user.innerHTML = username;
        user.className = "user";
        user.style.color = "#f638dc";

        const dateDiv = document.createElement("div");
        dateDiv.innerHTML = " 1 Hour Ago";
        dateDiv.className = "date";
        dateDiv.style.color = "rgba(256,256,256,0.6)";

        const p = document.createTextNode(" signed in ");

        summaryDiv.append(user)
        summaryDiv.append(p)
        summaryDiv.appendChild(dateDiv)


        labelDiv.append(icon)

        contentDiv.appendChild(summaryDiv)

        eventDiv.appendChild(labelDiv)
        eventDiv.appendChild(contentDiv)

        document.querySelector("#usernames").append(eventDiv)
    }
})

var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

// Helper functions

function onMessageSubmit(event, username, userID) {
    event.preventDefault()
    message = document.querySelector("#message")
    createMessage(username, true, message.value)
    let roomURL = location.pathname.split('/')
    const room = roomURL[roomURL.length -1]
    socket.emit("message sent", {
        "username": username,
        "message": message.value,
        "room": room,
        "userID": userID
    })
    message.value = ""
}

const handleSignOut = () => {
    const userID = window.localStorage.getItem("userID")
    fetch(location.protocol + '//' + document.domain + ':' + location.port + "/sign_out", {
        method: "POST",
        headers: {
            "userID": userID
        }
    })
};

const handleAddPassword = () => {
    const checkBox = document.querySelector("#passwordCheck")
    const password = document.querySelector("#password")
    if (checkBox.checked) {
        password.className = "inline field"
    } else {
        password.className = "inline field hide"
    }
}

function createMessage(username, me, message) {

    const chatDiv = document.createElement("div")
    if (me) {
        chatDiv.className = "ui event padded raised segment my-message";
    } else {
        chatDiv.className = "ui event padded raised segment chat-message";
    }

    const labelDiv = document.createElement("div");
    labelDiv.className = "label";

    const labelIcon = document.createElement("i");
    labelIcon.className = "user circle icon";
    if (me) {
        labelIcon.style.color = "rgba(256,256,256,0.8)";
    } else {
        labelIcon.style.color = "rgb(32,15,33)";
    }
    

    const contentDiv = document.createElement("div");
    contentDiv.className = "content";
    contentDiv.style.marginLeft = "1%";

    const summaryDiv = document.createElement("div");
    summaryDiv.className = "summary";
    if (me) {
        summaryDiv.style.color = "rgba(256,256,256,0.8)";
    } else {
        summaryDiv.style.color = "rgb(32,15,33)";
    }


    const user = document.createElement("p")
    user.className = "user";
    user.innerHTML = username;
    user.style.color = "#f638dc";

    const p = document.createTextNode(" - today at 11:30 ");

    const messageDiv = document.createElement("div")
    messageDiv.className = "extra text"
    messageDiv.innerHTML = message
    if (me) {
        messageDiv.style.color = "rgba(256,256,256,0.6)";
        messageDiv.style.fontWeight = "normal"
    } else {
        messageDiv.style.color = "rgb(32,15,33)";
    }

    chatDiv.appendChild(labelDiv)
    chatDiv.appendChild(contentDiv)

    labelDiv.append(labelIcon)

    contentDiv.appendChild(summaryDiv)

    summaryDiv.append(user)
    summaryDiv.append(p)
    summaryDiv.appendChild(messageDiv)

    document.querySelector('#messageFeed').appendChild(chatDiv)
}