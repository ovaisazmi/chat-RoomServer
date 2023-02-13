let urlParams= new URLSearchParams(window.location.search);
const username = urlParams.get("username")
const room = urlParams.get("room")
// console.log(username,room);

const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");
const roomName = document.getElementById("room-name");
const userList = document.getElementById("users");


const socket = io("http://localhost:8080/",{transports:["websocket"]});

socket.emit("userJoined",({username,room}))

socket.on("message",msg=>{
    outputMessage(msg)
    chatMessages.scrollTop=chatMessages.scrollHeight;
})

socket.on("roomUsers",({users,room})=>{
    roomName.innerText=room;
    appendUsers(users)
})

function appendUsers(users){
    userList.innerHTML="";
        users.forEach(element => {
        userList.innerHTML+=`
        <li>${element.username}</li>
        `
    });
}


function outputMessage(message){
    chatMessages.innerHTML+=`
    <div class="message">
    <p class="meta">${message.username}<span> ${message.time}</span> </p>
    <p class="text">${message.text}</p>
    </div>
    `
}

chatForm.addEventListener("submit",(e)=>{
    e.preventDefault();
    let data=document.getElementById("msg");

    if(data.value==""){
        return
    }
    socket.emit("sendMessage",data.value)
    data.value="";
    data.focus()
})

document.getElementById("leave-btn").addEventListener("click",()=>{
    
    window.location.href="index.html"

})

