document.addEventListener("DOMContentLoaded", () => {

    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

    socket.on('user login', data => {
        const usernames = data.usernames
        window.localStorage.setItem("displayName", data.display_name)
        
        document.querySelector("#usernames").innerHTML = ""

        usernames.forEach(i => {
            displayUser(i["display_name"])
        });
    });

    function displayUser(username) {
        const eventDiv = document.createElement("div")
        eventDiv.className = "event"
        
        const labelDiv = document.createElement("div")
        labelDiv.className = "label"

        const icon = document.createElement("i")
        icon.className = "user circle icon"
        icon.style.color = "white"

        const contentDiv = document.createElement("div")
        contentDiv.className = "content"
        contentDiv.style.marginLeft = "1%"

        const summaryDiv = document.createElement("div")
        summaryDiv.className = "summary"
        summaryDiv.style.color = "white"

        const user = document.createElement("p")
        user.innerHTML = username
        user.className = "user"
        user.style.color = "#f638dc"

        const dateDiv = document.createElement("div")
        dateDiv.innerHTML = "                                1 hour ago"
        dateDiv.className = "date"
        dateDiv.style.color = "rgba(256,256,256,0.6)"

        const p = document.createTextNode(" signed in")

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