module.exports = () => {
	class User {
		id;
		email;

		constructor(data) {
			this.id = data.id;
			this.email = data.email;
		}

		getRoles() {
			return ["ROLE_USER"];
		}
	}

	return User;
};
