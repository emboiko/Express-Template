const express = require("express");
const helmet = require("helmet");
const passport = require("passport");
const flash = require("express-flash");
const session = require("express-session");
const methodOverride = require("method-override");
const loginRouter = require("./routers/login");
const { initializePassport } = require("./auth/passport");
require("./db/mongoose");

initializePassport(passport);

const app = express();
app.use(helmet());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(flash());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride("_method"));
app.set("view engine", "ejs");

app.use(loginRouter);

app.get("/", (req, res) => {
    if (req.user) {
        res.render("home", { username: req.user.username });
    } else {
        res.render("home")
    }
});

app.get("*", (req, res) => {
    res.status(404).render("not_found");
});

module.exports = app;
