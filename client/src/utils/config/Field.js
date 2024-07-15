import {
	camelToCapitalCase,
	formatDatetime,
	formatDate,
	formatPrice,
	formatPercentage,
} from "../format";
import Table from "./Table";
import { containsAll } from "../array.js";

const formatters = {
	default: (value) => `${value ?? ""}`,
	date: formatDate,
	datetime: formatDatetime,
	price: formatPrice,
	percentage: formatPercentage,
};

class Field {
	_name;
	_data;
	_table;

	constructor(table, name) {
		this._table = table instanceof Table ? table : new Table(table);
		this._name = name;
		this._data = this._table._data.fields[name];
	}

	getName() {
		return this._name;
	}

	getTable() {
		return this._table;
	}

	isExternal() {
		return this._data?.external ?? false;
	}

	isInternal() {
		return !this.isExternal();
	}

	getTableHeader() {
		return this._data?.table?.header ?? camelToCapitalCase(this.getName());
	}

	getTableFormatter() {
		return formatters[this._data?.table?.formatter ?? "default"];
	}

	isVisibleInTable() {
		return this._data?.table?.visible ?? true;
	}

	getFormAttributes() {
		return (
			this._data?.form?.attributes ?? {
				type: this.getFormAttributesType(),
			}
		);
	}

	isVisibleInForm() {
		return this._data?.form?.visible ?? true;
	}

	isVisibleInFormForUser(user) {
		return this._data?.form?.visible ??
			this.getFormVisibleFor().includes("PUBLIC_ACCESS")
			? true
			: containsAll(user.getRoles(), this.getFormVisibleFor());
	}

	isVisibleInFormForUserAndAction(user, action) {
		return (
			this.isVisibleInFormForAction(action) &&
			this.isVisibleInFormForUser(user)
		);
	}

	isVisibleInFormForAction(action) {
		return this._data?.form?.[action] ?? true;
	}

	getFormVisibleFor() {
		return this._data?.form?.visibleFor ?? ["PUBLIC_ACCESS"];
	}

	getFormattedValue(value) {
		return this.getTableFormatter()(value);
	}

	getFormLabel() {
		return this._data?.form?.label ?? camelToCapitalCase(this.getName());
	}

	getFormAttributesType() {
		return (
			this._data?.form?.attributes?.type ??
			(this.isExternal() ? "select" : "text")
		);
	}

	getFormAttributesForAction(action) {
		return {
			...(this._data?.form?.actions?.[action]?.attributes ?? {}),
			...this.getFormAttributes(),
		};
	}

	getFormValue() {
		return this._data?.form?.value ?? null;
	}

	getFormAttributesDefaultValue() {
		const type = this.getFormAttributes().type ?? "text";
		let def = this._data?.form?.attributes?.defaultValue;
		if (def === null || def === undefined) {
			if (["select", "choice"].includes(type)) {
				def = [];
			}
		} else if (["date", "datetime-local"].includes(type)) {
			switch (def) {
				case "now":
					def = new Date();
					break;
			}
		}
		return def ?? "";
	}

	getFormAttributesMultiple() {
		return this._data.form?.multiple ?? false;
	}
}

export default Field;
