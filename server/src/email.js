const config = require("../config/config.json");
const emailjs = require("@emailjs/browser");

exports.send = (type, params) => {
	emailjs.send(config.env.email.GMAIL_SERVICE_ID, type, params);
};
