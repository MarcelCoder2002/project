module.exports = {
	apps: [
		{
			name: "marcel-project-client",
			script: "cd client && yarn start && cd ../",
		},
		{
			name: "marcel-project-server",
			script: "cd server && yarn start && cd ../",
		},
	],
};
