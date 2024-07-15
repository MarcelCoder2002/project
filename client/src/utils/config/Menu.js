import { snakeToCapitalCase } from "../format";
import config from "../../config/config.json";
import { containsAll, last } from "../array";
import Table from "./Table";
import Domain from "./Domain";

class Menu {
	_name;
	_data;
	_parent = null;
	_subMenus = null;
	_domains = null;
	_link = null;

	static _menus = new Map();

	constructor(name, parent = null) {
		this._name = name;
		this._parent = parent;
		if (parent) {
			this._data = parent._data.subMenus[name];
		} else {
			this._data = config.menu[name];
		}
	}

	getName() {
		return this._name;
	}

	getIcon() {
		return this._data?.icon
			? `${this._data?.icon} nav-icon`
			: "far fa-circle nav-icon";
	}

	getTitle() {
		return this._data?.title ?? snakeToCapitalCase(this.getName());
	}

	getRoles() {
		return (
			this._data?.roles ?? this._parent?.getRoles() ?? ["PUBLIC_ACCESS"]
		);
	}

	getDomainObjects() {
		if (!this._domains) {
			this._domains = new Map();
			for (const name of this.getDomains()) {
				this._domains.set(name, Domain.getDomain(name));
			}
		}
		return this._domains;
	}

	getDomains() {
		return this._data?.domains ?? this._parent?.getDomains() ?? [];
	}

	getDomain(name) {
		return this.getDomainObjects().get(name);
	}

	getParent() {
		return this._parent;
	}

	getSubMenuObjects() {
		if (!this._subMenus) {
			this._subMenus = new Map();
			for (const name of Object.keys(this._data?.subMenus ?? {})) {
				const menu = new Menu(name, this);
				this._subMenus.set(name, menu);
				Menu._menus.set(name, menu);
			}
		}
		return this._subMenus;
	}

	getSubMenus() {
		return Array.from(this.getSubMenuObjects.keys());
	}

	isSubMenu() {
		return !!this.getParent();
	}

	hasSubMenu() {
		return this.getSubMenuObjects().size > 0;
	}

	inDomain(domain) {
		if (!domain instanceof Domain) {
			domain = Domain.getDomain(domain);
		}
		return !!this.getDomain(domain.getName());
	}

	// getLink(domain) {
	// 	if (!this._link) {
	// 		this._link = !this.isSubMenu() ? this.get : '';
	// 	} return this._link;
	// }

	static getMenu(name) {
		if (this._menus.size === 0) {
			for (const name of Object.keys(config.menu)) {
				const menu = new Menu(name);
				Menu._menus.set(name, menu);
				menu.getSubMenuObjects();
			}
		}
		return this._menus.get(name);
	}

	static getMenuForRoles(roles) {
		if (!Array.isArray(roles)) {
			roles = [roles];
		}
		this.getMenu("");
		const menus = [];
		for (const [name, menu] of this._menus) {
			if (
				menu.getRoles().includes("PUBLIC_ACCESS") ||
				containsAll(roles, menu.getRoles())
			) {
				if (!menu.isSubMenu()) {
					menus.push({ menu: menu, subMenus: [] });
				} else if (
					!Table.isTable(name) ||
					Table.getTable(name)?.isMenu()
				) {
					last(menus).subMenus.push(menu);
				}
			}
		}
		return menus;
	}

	static getMenuForUserAndDomain(user, domain) {
		if (!domain instanceof Domain) {
			domain = Domain.getDomain(domain);
		}
		const roles = user.getRoles();
		this.getMenu("");
		const menus = [];
		for (const [name, menu] of this._menus) {
			if (
				menu.getRoles().includes("PUBLIC_ACCESS") ||
				containsAll(roles, menu.getRoles())
			) {
				if (menu.inDomain(domain)) {
					if (!menu.isSubMenu()) {
						menus.push({ menu: menu, subMenus: [] });
					} else if (
						!Table.isTable(name) ||
						Table.getTable(name)?.isMenu()
					) {
						last(menus).subMenus.push(menu);
					}
				}
			}
		}
		return menus;
	}
}

export default Menu;
