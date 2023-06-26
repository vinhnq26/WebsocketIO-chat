const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);

app.set("view engine", "ejs")
app.set("views", "./views")
const { Server } = require("socket.io");
const io = new Server(server);
const namesChat = [];
const namesChathasid = [];
app.get('/', (req, res) => {
  res.render("trangchu");
});

server.listen(process.env.PORT || 3000);

io.on('connection', (socket) => {
    console.log('a user connected  ' + socket.id);
    socket.on('disconnect', () => {
        console.log('user disconnected  ' + socket.id);
        const namesChathasidFilted = namesChathasid?.filter((v) => v.id != socket.id)
        io.sockets.emit("server-users-offline" , namesChathasidFilted)
      });
    socket.on('chat message', (msg) => {
        io.sockets.emit("server-send-msg" , msg)
    });
    socket.on('inputRegister_value', (name) => {
   
            if( namesChat?.includes(name)){
               socket.emit("register-fail")
            } else {
                namesChat.push(name);
                namesChathasid.push({name:name, id:socket.id});
                socket.userName = name ;
                keepname = name;
                socket.emit("register-success",name);
                io.sockets.emit("server-users-online" , namesChat)
            }
            if(namesChat?.length <= 0){
            namesChat.push(name)
            namesChathasid.push({name:name, id:socket.id});
            socket.emit("register-success",name)
            }
    });
  });