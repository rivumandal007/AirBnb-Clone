
  require("dotenv").config();


const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");


const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");



// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const dbUrl = process.env.ATLASDB_URL;
console.log(dbUrl);


(async () => {
  try {
    await mongoose.connect(dbUrl);
    console.log("[MongoDB] Connected...")
  } catch (err) {
    console.log("MongoDB connection failed!", err)
  }
})()

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

const sessionOptions = {
  secret: "mysuperseretcode",
  resave: false,
  saveUninitialized: true,
  cookie : {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge:  7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  }
}
// app.get("/", (req, res) => {
//   res.send("Hi, I am root");
// });



app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));


passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

// //demo user
// app.get("/demouser", async(req, res) => {
//   let fakeUser = new User ({
//     email: "rivumandal007@gmail.com",
//     username: "rivu007",
//   })

//   let registerUser = await User.register(fakeUser, "gojo007");
//   res.send(registerUser);
// });


app.use("/listings",listingRouter);
app.use("/listings/:_id/reviews", reviewRouter);
app.use("/", userRouter);


app.use((req, res, next) => {
  next(new ExpressError(404, "Page not found!"));
})
app.use((err, req, res, next) => {
  let {statusCode = 500, message = "Something went worng."} = err;
  res.status(statusCode).render("error.ejs", {err});
});

app.listen(8080, () => {
  console.log("server is listening to port 8080");
});
