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



const corsOptions = {
    origin: 'http://localhost:9000',
}

const base_url = "/api";
const PORT = process.env.PORT || 3000;
const app = express();

app.use(morgan("dev"));
app.use(cors(corsOptions));
app.use(express.json());


app.use(`${base_url}/users`, users);
app.use(`${base_url}/profiles`, profiles);
app.use(`${base_url}/products`, products);
app.use(`${base_url}/products-categories`, productCategory);


app.use(error);

app.get('/', (req, res) => {
  res.json({
      message: 'Welcome to Barterify REST API'
  })
});

app.listen(PORT, () => {
  console.log(`Now listening on port: ${PORT}`);
});


