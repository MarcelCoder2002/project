import Content from "../../components/Content.jsx";
import Header from "../../components/Header.jsx";
import { get } from "../../utils/requests.js";
import { redirect, useLoaderData } from "react-router-dom";
import { formatDatetime } from "../../utils/format.js";
import React, { useEffect } from "react";

import "../../../plugins/datatables/jquery.dataTables.min.js";
import "../../../plugins/datatables-bs4/js/dataTables.bootstrap4.min.js";
// import "datatables.net-plugins/sorting/currency.js";
// import "datatables.net-plugins/type-detection/currency.js";

import "../../../assets/css/index.css";
import { getBackendURL } from "../../utils/url";

export const loader = async ({ params }) => {
	try {
		return (await get(getBackendURL(`/api/me/purchases`))).data;
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
					const pageLength = 10;
					const achat = data[row.index()];
					row.child(format(achat)).show();
					tr.addClass("shown");
					const sup = achat.includes.detail.length > pageLength;
					$(`#subtable-${achat.code}`).DataTable({
						columnDefs: [{ type: "currency", target: 3 }],
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

					const wrapper = document.getElementById(
						`subtable-${achat.code}_wrapper`
					);
					const wrapper_head = wrapper.firstChild;
					const tools = wrapper_head.firstChild;

					wrapper.classList.add("card", "card-secondary");
					wrapper_head.classList.add("card-header");
					tools.classList.add("card-tools");
					wrapper.children[1].classList.add("card-body");
					wrapper.children[2].classList.add("card-footer");
					tools.innerHTML = `<button type="button" class="btn btn-tool" data-card-widget="maximize"><i class="fas fa-expand" /></button>`;

					const f = () => {
						wrapper.parentElement.style.padding = 0;
						wrapper.style.marginBottom = 0;
						wrapper.style.borderRadius = 0;
						for (const child of wrapper.children) {
							child.style.marginLeft = 0;
							child.style.marginRight = 0;
							child.style.borderRadius = 0;
							if (wrapper.classList.contains("maximized-card")) {
								if (!child.classList.contains("card-body")) {
									child.style.backgroundColor =
										"var(--secondary)";
								} else {
									child.style.backgroundColor = "white";
								}
							} else {
								child.style.backgroundColor =
									"var(--secondary)";
							}
						}
					};

					f();

					const observer = new MutationObserver(
						(mutationsList, observer) => {
							for (const mutation of mutationsList) {
								if (
									mutation.type === "attributes" &&
									mutation.attributeName === "class"
								) {
									f();
								}
							}
						}
					);

					observer.observe(wrapper, {
						attributes: true,
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
