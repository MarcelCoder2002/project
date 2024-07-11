import Table from "./Table.js";
import {containsAll} from "../array.js";

class Action {
    _name;
    _data;
    _table;

    constructor(table, name) {
        this._table = table instanceof Table ? table : new Table(table);
        this._name = name;
        this._data = this._table._data?.actions?.[name] ?? {};
    }

    getName() {
        return this._name;
    }

    getTable() {
        return this._table;
    }

    getRoles() {
        return this._data?.roles ?? ["PUBLIC_ACCESS"];
    }

    isVisibleFor(roles) {
        if (!Array.isArray(roles)) {
            roles = [roles];
        }
        return this.getRoles().includes('PUBLIC_ACCESS') ? true : containsAll(roles, this.getRoles());
    }
}

export default Action;