const express = require("express");
const app = express();

const home_router = require("./routes/home");
app.use("/", home_router);
const profile_router = require("./routes/profile");
app.use("/profile", profile_router);
const admin_router = require("./routes/admin");
app.use("/admin", admin_router);

module.exports = app;
