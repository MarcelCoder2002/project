import { snakeToCapitalCase } from "../format";
import Table from "./Table";

class Dependency {
	_name;
	_data;
	_table;

	constructor(table, name) {
		this._table = table instanceof Table ? table : new Table(table);
		this._name = name;
		this._data = this._table._data.dependencies[name];
	}

	getName() {
		return this._name;
	}

	getTable() {
		return this._table;
	}

	isUnique() {
		return this._data.unique ?? true;
	}

	getFormTitle() {
		return this._data.form?.title ?? snakeToCapitalCase(this.getName());
	}

	getFormAttributes() {
		return this._data.form?.attributes ?? {};
	}

	isFormVisibleForUserAndAction(user, action) {
		return Table.getTable(this._name).isFormVisibleForUserAndAction(
			user,
			action
		);
	}
}

export default Dependency;
