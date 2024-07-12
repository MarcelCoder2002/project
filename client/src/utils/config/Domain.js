import config from "../../config/config.json";
import { snakeToCapitalCase } from "../format";

class Domain {
	_name;
	_data;

	static _domains;

	constructor(name) {
		this._name = name;
		this._data = config.domains[name];
	}

	getName() {
		return this._name;
	}

	getRoles() {
		return this._data?.roles ?? ["PUBLIC_ACCESS"];
	}

	getTitle() {
		return this._data?.title ?? this.getName() !== ""
			? snakeToCapitalCase(this.getName())
			: "Jolof System";
	}

	static getDomainObjects() {
		if (!this._domains) {
			this._domains = new Map();
			for (const name of Object.keys(config.domains)) {
				this._domains.set(name, new Domain(name));
			}
		}
		return this._domains;
	}

	static getDomains() {
		return Array.from(this.getDomainObjects().keys());
	}

	static getDomain(name) {
		return this.getDomainObjects().get(name);
	}
}

export default Domain;
