const mongoose = require("mongoose");
require("dotenv").config();

const url = process.env.MONGODB_URL;

mongoose.
connect( url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to the Database');
}).catch((err) => {
  console.error('Cannot connect to the Database', err);
  process.exit();
});

module.exports = mongoose;
