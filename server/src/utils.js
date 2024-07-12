const fs = require("fs");
const path = require("path");

exports.findAuthenticatorFiles = (dir, fileList = []) => {
	const files = fs.readdirSync(dir);

	files.forEach((file) => {
		const filePath = path.join(dir, file);
		const stat = fs.statSync(filePath);

		if (stat.isDirectory()) {
			this.findAuthenticatorFiles(filePath, fileList);
		} else if (file.endsWith("Authenticator.js")) {
			fileList.push(filePath);
		}
	});

	return fileList;
};

exports.divmod = (a, b) => {
	if (b === 0) {
		throw new Error("Division by zero is not allowed.");
	}
	const quotient = Math.floor(a / b);
	const remainder = a % b;
	return [quotient, remainder];
};

exports.snakeToCamel = (snakeCaseStr) => {
	const camelCaseStr = snakeCaseStr
		.toLowerCase()
		.replace(/(_\w)/g, (match) => match[1].toUpperCase());
	return camelCaseStr.charAt(0).toUpperCase() + camelCaseStr.slice(1);
};
