module.exports = {
	apps: [
		{
			name: "marcel-project-client",
			script: "cd client && npm run start && cd ../",
		},
		{
			name: "marcel-project-server",
			script: "cd server && npm run start && cd ../",
		},
	],
};
