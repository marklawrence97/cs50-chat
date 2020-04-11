document.addEventListener("DOMContentLoaded", () => {

    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

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