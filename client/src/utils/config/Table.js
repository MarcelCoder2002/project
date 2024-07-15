import config from "../../config/config.json";
import Dependency from "./Dependency";
import ExternalField from "./ExternalField";
import Field from "./Field";
import Action from "./Action.js";

class Table {
	_name;
	_data;

	_actions = null;
	_fields = null;
	_externalFields = null;
	_dependencies = null;

	static _tables = null;
	static _menuTables = null;

	constructor(name) {
		this._name = name;
		this._data = config.tables[name];
	}

	static getTable(name) {
		return this.getTableObjects().get(name) ?? null;
	}

	static getTables() {
		return Array.from(this.getTableObjects().keys());
	}

	static getTableObjects() {
		if (this._tables === null) {
			this._tables = new Map();
			for (const name of Object.keys(config.tables ?? {})) {
				this._tables.set(name, new Table(name));
			}
		}
		return this._tables;
	}

	static getMenuTable(name) {
		return this.getMenuTableObjects().get(name) ?? null;
	}

	static getMenuTables() {
		return Array.from(this.getMenuTableObjects().keys());
	}

	static getMenuTableObjects() {
		if (this._menuTables === null) {
			this._menuTables = new Map();
			for (const name of Object.keys(config.tables)) {
				const table = new Table(name);
				if (table.isMenu()) {
					this._menuTables.set(name, table);
				}
			}
		}
		return this._menuTables;
	}

	static getField(table, field) {
		return this.getTable(table).getField(field);
	}

	getName() {
		return this._name;
	}

	getId() {
		return this._data.id ?? "id";
	}

	isMenu() {
		return this._data.menu ?? true;
	}

	getField(name) {
		return (
			this.getExternalFieldObjects().get(name) ??
			this.getFieldObjects().get(name) ??
			null
		);
	}

	getFields() {
		return Array.from(this.getFieldObjects().keys());
	}

	getFieldObjects() {
		if (this._fields === null) {
			this._fields = new Map();
			for (const name of Object.keys(this._data.fields ?? {})) {
				this._fields.set(name, new Field(this, name));
			}
		}
		return this._fields;
	}

	getDependency(name) {
		return this.getDependencyObjects().get(name) ?? null;
	}

	getDependencies() {
		return Array.from(this.getDependencyObjects().keys());
	}

	getDependencyObjects() {
		if (this._dependencies === null) {
			this._dependencies = new Map();
			for (const name of Object.keys(this._data.dependencies ?? {})) {
				this._dependencies.set(name, new Dependency(this, name));
			}
		}
		return this._dependencies;
	}

	hasDependency() {
		return this.getDependencies().length > 0;
	}

	hasDependencyFormForUserAndAction(user, action) {
		if (this.hasDependency()) {
			for (const [name, dependency] of this.getDependencyObjects()) {
				if (dependency.isFormVisibleForUserAndAction(user, action)) {
					return true;
				}
			}
		}
		return false;
	}

	getExternalField(name) {
		return this.getExternalFieldObjects().get(name) ?? null;
	}

	getExternalFields() {
		return Array.from(this.getExternalFieldObjects().keys());
	}

	getExternalFieldObjects() {
		if (this._externalFields === null) {
			this._externalFields = new Map();
			for (const name of Object.keys(this._data.fields ?? {})) {
				if (this._data.fields?.[name]?.external) {
					this._externalFields.set(
						name,
						new ExternalField(this, name)
					);
				}
			}
		}
		return this._externalFields;
	}

	getOption() {
		return {
			format: this.getOptionFormat(),
			defaultValues: this.getOptionDefaultValues(),
		};
	}

	getOptionFormat() {
		return this._data.option?.format ?? `%${this.getId()}%`;
	}

	getOptionDefaultValues() {
		return this._data.option?.defaultValues ?? [];
	}

	getAction(name) {
		return this.getActionObjects().get(name) ?? null;
	}

	getActions() {
		return Array.from(this.getActionObjects().keys());
	}

	getActionObjects() {
		if (this._actions === null) {
			this._actions = new Map();
			for (const name of Object.keys(this._data.actions ?? {})) {
				this._actions.set(name, new Action(this, name));
			}
			if (this._actions.size === 0) {
				for (const name of ["new", "show", "edit", "delete"]) {
					this._actions.set(name, new Action(this, name));
				}
			}
		}
		return this._actions;
	}

	getActionsForUser(user) {
		const actions = [];
		for (const [name, action] of this.getActionObjects()) {
			if (action.isVisibleFor(user.getRoles())) {
				actions.push(name);
			}
		}
		return actions;
	}

	getVisibleFieldsInFormForUserAndAction(user, action) {
		const fields = [];
		for (const [name, field] of this.getFieldObjects()) {
			if (field.isVisibleInFormForUserAndAction(user, action)) {
				fields.push(field);
			}
		}
		return fields;
	}

	isFormVisibleForUserAndAction(user, action) {
		for (const [name, field] of this.getFieldObjects()) {
			if (field.isVisibleInFormForUserAndAction(user, action)) {
				return true;
			}
		}
		return false;
	}

	static isTable(name) {
		return this.getTable(name) !== null;
	}
}

export default Table;
