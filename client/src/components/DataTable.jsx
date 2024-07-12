import { snakeToCapitalCase } from "../utils/format";
import { Form, NavLink, useLocation, useParams } from "react-router-dom";
import Table from "../utils/config/Table";
import { useEffect, useState } from "react";

// import "../../plugins/datatables/jquery.dataTables";
// import "../../plugins/datatables-buttons/js/dataTables.buttons";

import "../../plugins/datatables/jquery.dataTables.min.js";
import "../../plugins/datatables-bs4/js/dataTables.bootstrap4.min.js";
import "../../plugins/datatables-responsive/js/dataTables.responsive.min.js";
import "../../plugins/datatables-responsive/js/responsive.bootstrap4.min.js";
import "../../plugins/datatables-buttons/js/dataTables.buttons.min.js";
import "../../plugins/datatables-buttons/js/buttons.bootstrap4.min.js";
import "../../plugins/jszip/jszip.min.js";
import "../../plugins/pdfmake/pdfmake.min.js";
// import "../../plugins/pdfmake/vfs_fonts.js";
import "../../plugins/datatables-buttons/js/buttons.html5.min.js";
import "../../plugins/datatables-buttons/js/buttons.print.min.js";
import "../../plugins/datatables-buttons/js/buttons.colVis.min.js";

export default function DataTable({ actions, tableName, rows = [] }) {
	const { name } = useParams();
	const table = new Table(tableName ?? name);
	let fields = Array.from(table.getFieldObjects().values());

	useEffect(() => {
		const t = $("#datatable").DataTable({
			layout: {
				topStart: {
					buttons: [
						"copy",
						"csv",
						"excel",
						// "pdf",
						"print",
						"colvis",
					],
				},
			},
			destroy: true,
			responsive: true,
			lengthChange: false,
			autoWidth: true,
			ordering: true,
			paging: true,
		});

		return function () {
			t.destroy();
		};
	}, []);

	if (fields.length === 0) {
		throw new Error("error");
	}

	return (
		<div className="card">
			<div className="card-header">
				<h3 className="card-title">{snakeToCapitalCase(tableName ?? name)}</h3>
			</div>
			{/* <!-- /.card-header --> */}
			<div className="card-body">
				<table
					id="datatable"
					className="table table-bordered table-striped"
				>
					<thead>
						<tr>
							{fields.map((field, key) =>
								!field.isVisibleInTable() ? null : field.getName() ===
								  table.getId() ? (
									<th className="table-row-id" key={key}>
										#
									</th>
								) : (
									<th key={key}>{field.getTableHeader()}</th>
								)
							)}
							<th></th>
						</tr>
					</thead>
					<tbody>
						{rows.map((row, key) => (
							<tr key={key}>
								{fields.map((field, key) =>
									!field.isVisibleInTable() ? null : field.getName() ===
									  table.getId() ? (
										<td className="table-row-id" key={key}>
											{field.getFormattedValue(
												row[field.getName()]
											)}
										</td>
									) : (
										<td key={key}>
											{field.getFormattedValue(
												row[field.getName()]
											)}
										</td>
									)
								)}
								<td>
									{!actions.includes("show") ? null : (
										<NavLink
											to={`show/${row[table.getId()]}`}
											className="btn btn-info btn-sm"
											style={{ marginRight: 15 }}
										>
											<i className="fas fa-folder"></i>
											&nbsp; Voir
										</NavLink>
									)}
									{!actions.includes("edit") ? null : (
										<NavLink
											to={`edit/${row[table.getId()]}`}
											className="btn btn-primary btn-sm"
											style={{ marginRight: 15 }}
										>
											<i className="fas fa-pencil-alt"></i>
											&nbsp; Modifier
										</NavLink>
									)}
									{!actions.includes("delete") ? null : (
										<Form
											style={{
												margin: 0,
												padding: 0,
												display: "inline",
											}}
											action={`/admin/management/${name}/delete/${
												row[table.getId()]
											}`}
											method="delete"
										>
											<button
												className="btn btn-danger btn-sm"
												type="submit"
											>
												<i className="fas fa-trash"></i>
												&nbsp; Supprimer
											</button>
										</Form>
									)}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}
