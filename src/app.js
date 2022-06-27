const mongoose = require("./config/db");
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
require("dotenv").config();
const { error } = require("./middleware/error");


const users = require("./routes/userRoute");
const profiles = require("./routes/profileRoute")
const products = require("./routes/productRoute");
const productCategory = require("./routes/productCategoryRoute");
const barters = require("./routes/barterRoute");

const corsOptions = {
    origin: 'http://localhost:9000',
}

const base_url = "/api";
const PORT = process.env.PORT || 3000;
const app = express();

const io = require('socket.io')( 8000, {   // SOCKET PORT
  cors: {                                 // CROSS ORIGIN PERMISSION FOR CLIENT ADDRESS
    origin: ['http://localhost:9000'],    
  },
});

// DECLARING ARRAY OF users
const connectedUser = {};

io.on('connection', socket =>{

    // SERVER FUNCTION TO RESPONSE NEW USER
    socket.on('new-user-joined', userName =>{
      connectedUser[socket.id] = userName;
      socket.broadcast.emit('user-joined', {newUserName: connectedUser[socket.id], newUserId: socket.id});
    });

    // SERVER FUNCTION TO HANDLE MESSAGES
    socket.on('message-sended', messageSended =>{
      socket.broadcast.emit('message-received', {message: messageSended, senderName: connectedUser[socket.id], senderId: socket.id});
    });

    // SERVER FUNCTION ON DISCONNECTION OF USER
    socket.on('disconnect', message =>{
      socket.broadcast.emit('user-left', {leftUserName: connectedUser[socket.id], leftUserId: socket.id});
      delete connectedUser[socket.id];
  });

  });
  
app.use(morgan("dev"));
app.use(cors(corsOptions));
app.use(express.json());


app.use(`${base_url}/users`, users);
app.use(`${base_url}/profiles`, profiles);
app.use(`${base_url}/products`, products);
app.use(`${base_url}/products-categories`, productCategory);
app.use(`${base_url}/barters`, barters);
app.use('/uploads', express.static('./uploads'));

app.use(error);

app.get('/', (req, res) => {
  res.json({
      message: 'Welcome to Barterify REST API'
  })
});

app.listen(PORT, () => {
  console.log(`Now listening on port: ${PORT}`);
});


