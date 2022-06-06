const mongoose = require("./config/db");
const express = require("express");
const cors = require("cors");
require("dotenv").config();


const corsOptions = {
    origin: 'http://localhost:3000',
}

const base_url = "/api";
const PORT = process.env.PORT || 3000;
const app = express();

app.use(cors(corsOptions));
app.use(express.json());

app.get('/', (req, res) => {
  res.json({
      message: 'Welcome to Barterify REST API'
  })
});

app.listen(PORT, () => {
  console.log(`Now listening on port: ${PORT}`);
});


