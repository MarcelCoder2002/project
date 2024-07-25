const config = require("../config/config.json");
const nodemailer = require("nodemailer");

const mailer = nodemailer.createTransport({
	host: "localhost",
	port: 1025,
	secure: false,
});

exports.send = (options) => {
	mailer.sendMail(options, function (error, info) {
		if (error) {
			console.log("Error:", error);
		} else {
			console.log("Email sent:", info.response);
		}
	});
};
