const express = require("express");
const app = express();
const cors = require("cors");
const services = require("./security/services");

app.use(express.json());
app.use(cors());
app.use(services.firewallProvider);
app.use(services.userProvider);
app.use(services.accessControlChecker);

const api_router = require("./routes/api");
app.use("/api", api_router);
const home_router = require("./routes/home");
app.use("/", home_router);
const profile_router = require("./routes/profile");
app.use("/profile/", profile_router);
const admin_router = require("./routes/admin");
app.use("/admin/", admin_router);

module.exports = app;
