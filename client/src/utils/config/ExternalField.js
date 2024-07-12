import Field from "./Field";
import Table from "./Table";

class ExternalField extends Field {
	_originalTable = null;

	constructor(table, name) {
		super(table, name);
		this._originalTable = Table.getTable(name);
	}

	getOriginalTable() {
		return this._originalTable;
	}
}

export default ExternalField;
