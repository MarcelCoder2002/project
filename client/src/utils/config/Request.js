class Request {
	_user;
	_domain;

	constructor(user, domain) {
		this._user = user;
		this._domain = domain;
	}

	getUser() {
		return this._user;
	}

	getDomain() {
		return this._domain;
	}
}

export default Request;
