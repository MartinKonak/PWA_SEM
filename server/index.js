//využívání všech naisntalovaných dodatků
require('dotenv').config(); //připojení k env - API klíče
console.log(process.env.HARPERDB_URL); // remove this after you've confirmed it working
const express = require('express');
const app = express(); // aplikace Node JS express (typ frameworku?)
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io'); // definice typu serveru
// fce pro přístup do db - získané z harpera
const harperSaveMessage = require('./services/harper-save-message');
const harperGetMessages = require('./services/harper-get-messages');
const leaveRoom = require('./utils/leave-room');

app.use(cors()); // cors pro přístup ke komponentám frontendu

const server = http.createServer(app); //vytvoření http instance serveru - pak volám listen

// Create an io server and allow for CORS from http://localhost:3000 with GET and POST methods
// vytvoří io pro komunikaci s portem frontendu, cors povoluje připojení
const io = new Server(server, {
    cors: {
      origin: 'http://localhost:3000',
      methods: ['GET', 'POST'],
    },
  });


const CHAT_BOT = 'ChatBot'; //chat bot pro automatické zprávy

let chatRoom = '';
let allUsers = []; // list přihlášených uživatelů - výpis zúčastněných, kontrola duplikovaných jmen


// Listen for when the client connects via socket.io-client
//čeká na socket klienta až se připojí (popsáno v komentářích)
// realtime komunikace - tohle je ono!
io.on('connection', (socket) => { //pokud se frontend pokusí připojit, tenhle příkaz to zachytí
    console.log(`User connected ${socket.id}`); //má id konkrétního socketu = "okno kde jsem přihlášenej"

    socket.on('join_attempt', (data) => {//při pokusu o připojení vrátí userlist pro porovnání duplikátů
        const { username, room } = data;
        chatRoom = room;
        chatRoomUsers = allUsers.filter((user) => user.room === chatRoom);
        socket.emit('chatroom_users', chatRoomUsers); 
    });



    socket.on('join_room', (data) => {//event přihlášení do místnosti
    
        const { username, room } = data;
        socket.join(room);

        let __createdtime__ = Date.now();
        // Send messages to the room
        socket.to(room).emit('receive_message', {
          message: `${username} has joined the chat room`,
          username: CHAT_BOT,
          __createdtime__,
        });

        socket.emit('receive_message', {
          message: `Welcome ${username}`,
          username: CHAT_BOT,
          __createdtime__,
        });

        // Save the new user to the room
        chatRoom = room;
        allUsers.push({ id: socket.id, username, room });
        chatRoomUsers = allUsers.filter((user) => user.room === room);
        socket.to(room).emit('chatroom_users', chatRoomUsers);
        socket.emit('chatroom_users', chatRoomUsers);  
        
        // Get last 100 messages sent in the chat room
        //pošle posledních 100 zpráv na socket aktuálního usera hned popřihlášení aby si mohl zobrazit chat
        harperGetMessages(room)
        .then((last100Messages) => {
          // console.log('latest messages', last100Messages);
          socket.emit('last_100_messages', last100Messages);
        })
        .catch((err) => console.log(err));
        
      });

      socket.on('send_message', (data) => { //socket pro odeslání zprávy do roomky - uvidí ji všichni
        const { message, username, room, __createdtime__ } = data;
        io.in(room).emit('receive_message', data); // Send to all users in room, including sender
        harperSaveMessage(message, username, room, __createdtime__) // Save message in db
          .then((response) => console.log(response))
          .catch((err) => console.log(err));
      });


      //socket pro odhlášení z roomky
      // odebrání uživatele a chatbot pro všechny ostatní že odešel
      socket.on('leave_room', (data) => {
        const { username, room } = data;
        socket.leave(room);
        const __createdtime__ = Date.now();
        // Remove user from memory
        allUsers = leaveRoom(socket.id, allUsers);
        socket.to(room).emit('chatroom_users', allUsers);
        socket.to(room).emit('receive_message', {
          username: CHAT_BOT,
          message: `${username} has left the chat`,
          __createdtime__,
        });
        console.log(`${username} has left the chat`);
        socket.emit('clearParams');
      });

      //disconect v případě že uživatel odejde jinak než tlačítkem leave - aby ho to smazalo z listu
      socket.on('disconnect', () => {
        console.log('User disconnected from the chat');
        const user = allUsers.find((user) => user.id == socket.id);
        if (user?.username) {
          allUsers = leaveRoom(socket.id, allUsers);
          socket.to(chatRoom).emit('chatroom_users', allUsers);
          socket.to(chatRoom).emit('receive_message', {
            message: `${user.username} has disconnected from the chat.`,
          });
        }
      });

    });



//-------------------------------------------------------
// hello world na port 4000 aby bylo vidět že server jede
app.get('/', (req, res) => {
    res.send('Hello world');
  });
//-------------------------------------------------------

server.listen(4000, () => 'Server is running on port 4000');