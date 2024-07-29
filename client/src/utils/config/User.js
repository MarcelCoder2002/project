import { containsAll } from "../array";
import { getAsset } from "../url";
import Domain from "./Domain";
import Menu from "./Menu";
import Table from "./Table";

class User {
	_data;
	_menu = null;

	constructor(data) {
		this._data = data;
	}

	getIncludesData(name) {
		return this._data?.includes?.[name] ?? [];
	}

	getId() {
		return this._data?.id ?? "";
	}

	getNom() {
		return this._data?.nom ?? "";
	}

	getPrenom() {
		return this._data?.prenom ?? "";
	}

	getFullName() {
		return `${this.getPrenom()} ${this.getNom()}`;
	}

	getRoles() {
		return this._data?.roles ?? ["ROLE_USER"];
	}

	hasRoles(roles) {
		roles = Array.isArray(roles) ? roles : [roles];
		return containsAll(roles, this.getRoles());
	}

	getMenu() {
		if (!this._menu) {
			this._menu = Menu.getMenuForRoles(this.getRoles());
		}
		return this._menu;
	}

	getMenuForDomain(domain) {
		if (!domain instanceof Domain) {
			domain = Domain.getDomain(domain);
		}
		if (!this._menu) {
			this._menu = Menu.getMenuForUserAndDomain(this, domain);
		}
		return this._menu;
	}

	hasMenu() {
		return this.getMenu().length > 0;
	}

	hasMenuForDomain(domain) {
		return this.getMenuForDomain(domain).length > 0;
	}

	getTableActions(table) {
		table = table instanceof Table ? table : new Table(table);
		return table.getActionsForUser(this);
	}

	isAuthenticated() {
		return this._data !== null || this.getRoles()[0] !== "ROLE_USER";
	}

	getImage() {
		return this.isAuthenticated()
			? getAsset("/img/user2-160x160.jpg")
			: getAsset("/img/user-1.avif");
	}
}

export default User;
