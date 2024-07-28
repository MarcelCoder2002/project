import { redirect, useNavigate, useSearchParams } from "react-router-dom";
import Content from "../../components/Content";
import Header from "../../components/Header";
import { delete_, get, post, put } from "../../utils/requests";
import { useEffect, useState } from "react";
import { getBackendURL } from "../../utils/url";

export const loader = async ({}) => {
	try {
		return (await get(getBackendURL(`/api/me/cart`))).data;
	} catch (error) {
		return redirect("/profile/login");
	}
};

const save = async () => {
	for (const tr of document.getElementById("table").children[1].children) {
		await put(getBackendURL(`/api/me/panier_ecommerce/edit/${tr.id}`), {
			quantite: tr.children[2].children[0].value,
		});
	}
	alert("Panier enregistré !");
};

const nothing = (event) => {
	event.preventDefault();
};

function Cart() {
	const links = {
		Profile: "/profile",
	};
	const [searchParams, setSearchParams] = useSearchParams();
	const navigate = useNavigate();
	let [data, setData] = useState([]);
	const [total, setTotal] = useState(0);

	const checkout = async () => {
		if (data.length > 0) {
			if (confirm("Êtes-vous sûr ?")) {
				await post(getBackendURL(`/api/me/checkout`));
				window.location.reload();
			}
		} else {
			alert("Ajoutez des produits !");
		}
	};

	const deleteCart = async (event) => {
		try {
			if (confirm("Êtes-vous sûr ?")) {
				const tr = event.target.parentElement.parentElement;
				const response = await delete_(
					getBackendURL(`/api/me/panier_ecommerce/delete/${tr.id}`)
				);
				if (response.data.status !== "error") {
					const temp = parseFloat(
						tr.children[3].children[0].innerText
					);
					setTotal(Math.abs(total - temp));
					tr.remove();
				}
			}
		} catch (e) {
			alert("Erreur !");
		}
	};

	const updateTotal = (event) => {
		const quantity = parseInt(event.target.value);
		const price = parseFloat(
			event.target.parentElement.parentElement.children[1].children[0]
				.innerText
		);
		const element =
			event.target.parentElement.parentElement.children[3].children[0];
		const temp = parseFloat(element.innerText);
		const newValue = parseFloat(
			Number.isInteger(quantity) ? quantity * price : 0
		);
		element.innerText = newValue.toFixed(2);
		setTotal(Math.abs(total + (newValue - temp)));
	};

	useEffect(() => {
		const updateCart = async () => {
			if (searchParams.has("id")) {
				setSearchParams("");
				try {
					await post(getBackendURL(`/api/me/panier_ecommerce/new`), {
						produit: searchParams.get("id"),
					});
				} catch (error) {
					navigate("/profile/login");
				}
			}
			try {
				let d = (await get(getBackendURL(`/api/me/cart`))).data;
				setData(d);
				let t = 0;
				for (const cart of d) {
					t += cart.quantite * cart.includes.produit.prix;
				}
				setTotal(t);
			} catch (error) {
				navigate("/profile/login");
			}
		};
		updateCart();
	}, []);

	return (
		<>
			<Content
				header={<Header title="Panier" links={links} />}
				main={
					<>
						<form onSubmit={nothing} action="" method="post">
							<div className="row">
								<div className="col-12">
									<div className="card">
										<div className="card-header">
											<h3 className="card-title">
												Panier
											</h3>
										</div>
										{/* ./card-header */}
										<div className="card-body">
											<table
												id="table"
												className="table table-bordered table-hover"
											>
												<thead>
													<tr>
														<th>Produit</th>
														<th>Prix</th>
														<th>Quantité</th>
														<th>Total</th>
													</tr>
												</thead>
												<tbody>
													{data.map((value, key) => (
														<tr
															id={value.id}
															key={key}
														>
															<td>
																{
																	value
																		.includes
																		.produit
																		.nom
																}
															</td>
															<td
																style={{
																	display:
																		"flex",
																	flexDirection:
																		"row",
																	justifyContent:
																		"space-between",
																}}
															>
																<div className="value">
																	{parseFloat(
																		value
																			.includes
																			.produit
																			.prix
																	).toFixed(
																		2
																	)}
																</div>
																<div className="money">
																	MAD
																</div>
															</td>
															<td>
																<input
																	onChange={
																		updateTotal
																	}
																	defaultValue={
																		value.quantite
																	}
																	min={1}
																	type="number"
																	required
																/>
															</td>
															<td
																style={{
																	display:
																		"flex",
																	flexDirection:
																		"row",
																	justifyContent:
																		"space-between",
																}}
															>
																<div className="value">
																	{parseFloat(
																		value
																			.includes
																			.produit
																			.prix *
																			value.quantite
																	).toFixed(
																		2
																	)}
																</div>
																<div className="money">
																	MAD
																</div>
															</td>
															<td>
																<button
																	className="btn btn-danger btn-sm"
																	type="button"
																	onClick={
																		deleteCart
																	}
																>
																	<i className="fas fa-trash"></i>
																	&nbsp;
																	Supprimer
																</button>
															</td>
														</tr>
													))}
												</tbody>
											</table>
											<div
												style={{
													marginTop: 20,
													display: "flex",
													flexDirection: "row",
													justifyContent:
														"space-between",
													fontSize: 20,
												}}
											>
												<div>Total: </div>
												<div
													style={{
														fontWeight: "bold",
													}}
												>
													{parseFloat(total).toFixed(
														2
													)}{" "}
													MAD
												</div>
											</div>
										</div>
										{/* /.card-body */}
										<div className="card-footer">
											<button
												onClick={save}
												type="button"
												className="btn btn-primary"
											>
												Enregistrer
											</button>
											<button
												onClick={checkout}
												type="button"
												className="btn btn-success float-right"
											>
												Valider
											</button>
										</div>
									</div>
									{/* /.card */}
								</div>
							</div>
						</form>
					</>
				}
			/>
		</>
	);
}

export default Cart;
