import Content from "../../components/Content.jsx";
import Header from "../../components/Header.jsx";
import { get } from "../../utils/requests.js";
import { redirect, useLoaderData } from "react-router-dom";
import { formatDatetime } from "../../utils/format.js";
import React, { useEffect } from "react";

import "../../../plugins/datatables/jquery.dataTables.min.js";
import "../../../plugins/datatables-bs4/js/dataTables.bootstrap4.min.js";

import "../../../assets/css/index.css";

export const loader = async ({ params }) => {
	try {
		return (await get(`http://localhost:8000/api/me/purchases`)).data;
	} catch (error) {
		return redirect("/profile/login");
	}
};

export function Purchases({ links }) {
	const data = useLoaderData();

	useEffect(() => {
		const table = $("#datatable").DataTable({
			destroy: true,
			responsive: true,
			lengthChange: false,
			autoWidth: false,
			ordering: true,
			paging: true,
		});

		$("#datatable tbody").on("click", "tr", function () {
			if (this.id !== "") {
				const tr = $(this).closest("tr");
				const row = table.row(tr);
				if (row.child.isShown()) {
					row.child.hide();
					tr.removeClass("shown");
				} else {
					const pageLength = 3;
					const achat = data[row.index()];
					row.child(format(achat)).show();
					tr.addClass("shown");
					const sup = achat.includes.detail.length > pageLength;
					$(`#subtable-${achat.code}`).DataTable({
						destroy: true,
						responsive: true,
						lengthChange: false,
						autoWidth: false,
						ordering: true,
						paging: sup,
						pageLength: pageLength,
						searching: sup,
						info: false,
					});
				}
			}
		});

		return function () {
			table.destroy();
		};
	}, [data]);

	const format = (rowData) => {
		return (
			`
				<table id="subtable-${rowData.code}" class="table table-bordered table-striped subtable">
					<thead>
						<tr>
							<th>Nom</th>
							<th>EAN1</th>
							<th>Quantité</th>
							<th>Total</th>
							<th>Points</th>
						</tr>
					</thead>
					<tbody>` +
			rowData.includes.detail
				.map(
					(detail) =>
						`<tr>
							<td>${detail.includes.produit.nom}</td>
							<td>${detail.includes.produit.ean1}</td>
							<td>${detail.quantite}</td>
							<td>${detail.total} MAD</td>
							<td>${detail.point}</td>
					</tr>`
				)
				.join("") +
			"</tbody></table>"
		);
	};

	return (
		<>
			<Content
				header={<Header title="Achats" links={links} />}
				main={
					<div className="card">
						<div className="card-header">
							<h3 className="card-title">Achats</h3>
						</div>
						{/* <!-- /.card-header --> */}
						<div className="card-body">
							<table
								id="datatable"
								className="table table-bordered table-striped"
							>
								<thead>
									<tr>
										<th>#</th>
										<th>Date</th>
										<th>Total</th>
										<th>En ligne</th>
									</tr>
								</thead>
								<tbody>
									{data.map((achat, key) => (
										<tr id={`${key}`} key={key}>
											<td>{achat.code}</td>
											<td>
												{formatDatetime(achat.date)}
											</td>
											<td>{achat.total} MAD</td>
											<td>
												{achat.magasin ? "Non" : "Oui"}
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>
				}
			/>
		</>
	);
}

export default Purchases;
