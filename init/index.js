const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
require("dotenv").config()
const MONGO_URL = process.env.ATLASDB_URL;

// main()
//   .then(() => {
//     console.log("connected to DB");
//   })
//   .catch((err) => {
//     console.log(err);
//   });

// async function main() {
//   await mongoose.connect(MONGO_URL);
// }

(async () => {
  await mongoose.connect(MONGO_URL);
})()

const initDB = async () => {
  await Listing.deleteMany({});
  initData.data = initData.data.map((obj) => ({...obj, owner:"68b05920e8d99b3eda4599af"}))
  await Listing.insertMany(initData.data);
  console.log("data was initialized");
};

initDB();