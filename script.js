const socket = io();

function joinChat() {
    const username = document.getElementById("username").value.trim();

    if (username === "") {
        alert("Please enter your name");
        return;
    }

    document.getElementById("loginBox").style.display = "none";
    document.getElementById("chatBox").style.display = "flex";

    socket.emit("join", username);
}

function sendMessage() {
    const input = document.getElementById("messageInput");
    const message = input.value.trim();

    if (message === "") {
        return;
    }

    // Send message to server
    socket.emit("chatMessage", message);

    // Clear input
    input.value = "";
    input.focus();
}

function handleEnter(event) {
    if (event.key === "Enter") {
        sendMessage();
    }
}

// Receive chat messages
socket.on("message", function (data) {

    const messages = document.getElementById("messages");

    const messageDiv = document.createElement("div");
    messageDiv.className = "message";

    messageDiv.innerHTML =
        "<strong>" + data.username + "</strong>" +
        "<small>" + data.time + "</small>" +
        "<p>" + data.message + "</p>";

    messages.appendChild(messageDiv);

    messages.scrollTop = messages.scrollHeight;
});

// User joined
socket.on("userJoined", function (data) {

    document.getElementById("onlineCount").textContent =
        "Online Users: " + data.count;

    addSystemMessage(data.username + " joined the chat");
});

// User left
socket.on("userLeft", function (data) {

    document.getElementById("onlineCount").textContent =
        "Online Users: " + data.count;

    addSystemMessage(data.username + " left the chat");
});

function addSystemMessage(text) {

    const messages = document.getElementById("messages");

    const div = document.createElement("div");

    div.className = "system-message";
    div.textContent = text;

    messages.appendChild(div);
}