import { useEffect, useRef, useState } from "react";
import { Form, useNavigate, useSearchParams } from "react-router-dom";
import request, { get } from "../utils/requests";
import qs from "qs";
import useSessionCart from "../hooks/useSessionCart";
import { isValid } from "../utils/date";
import { Toast } from "primereact/toast";

const getQuantite = (produit) => {
	produit.quantite = produit.quantite ?? 1;
	return produit.quantite;
};

const getPromotion = (produit) => {
	const p = produit?.includes?.promotion;
	if (p && isValid(p.dateDebut, p.dateFin)) {
		return p.pourcentage;
	}
	return 0;
};

const getTotal = (produit, quantite) => {
	return (
		(produit.prix - (getPromotion(produit) * produit.prix) / 100) *
		(quantite ?? getQuantite(produit))
	);
};

function Cart({ action, submit }) {
	const [searchParams, setSearchParams] = useSearchParams();
	const navigate = useNavigate();
	const [data, setData] = useSessionCart();
	const [total, setTotal] = useState(0);
	const [chequeCadeaux, setChequeCadeaux] = useState([]);
	const toast = useRef(null);

	const handleInputChange = (index, event) => {
		const values = [...chequeCadeaux];
		values[index] = event.target.value;
		setChequeCadeaux(values);
	};

	const handleAddField = () => {
		setChequeCadeaux([...chequeCadeaux, ""]);
	};

	const handleRemoveField = (index) => {
		const values = [...chequeCadeaux];
		values.splice(index, 1);
		setChequeCadeaux(values);
	};

	const addItem = (item) => {
		const exists = data.find((i) => i.id === item.id);
		if (exists) {
			setData(
				data.map((i) =>
					i.id === item.id ? { ...i, quantite: i.quantite + 1 } : i
				)
			);
		} else {
			setData([...data, { ...item, quantite: 1 }]);
		}
	};

	const removeItem = (id) => {
		setData(
			data.filter((item) => {
				if (item.id === id) {
					setTotal(Math.abs(total - getTotal(item)));
					return false;
				}
				return true;
			})
		);
	};

	const setItemQuantity = (id, quantity) => {
		quantity = parseInt(quantity);
		quantity = Number.isInteger(quantity) ? quantity : 1;
		quantity = quantity >= 1 ? quantity : 1;
		setData(
			data.map((i) => {
				if (i.id === id) {
					setTotal(
						Math.abs(total + (getTotal(i, quantity) - getTotal(i)))
					);
					return { ...i, quantite: quantity };
				}
				return i;
			})
		);
	};

	const clear = () => {
		setData([]);
	};

	useEffect(() => {
		const updateCheckout = async () => {
			if (searchParams.has("id")) {
				const query = qs.stringify({
					includes: ["promotion"],
				});
				setSearchParams("");
				const dd = (
					await get(
						`http://localhost:8000/api/table/produit/${searchParams.get(
							"id"
						)}?${query}`
					)
				).data;
				addItem(dd);
				data.push(dd);
			}
			try {
				const newTotal = data.reduce(
					(acc, item) => acc + getTotal(item),
					total
				);
				setTotal(newTotal);
			} catch (error) {
				navigate("/admin/login");
			}
		};
		updateCheckout();
	}, []);

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (
			await submit({
				request: { formData: async () => new FormData(e.target) },
				toast: toast.current,
			})
		) {
			clear();
			setTotal(0);
		}
	};

	return (
		<form onSubmit={handleSubmit} action={action} method="post">
			<Toast ref={toast} />
			<div className="row">
				<div className="col-12">
					<div className="card">
						<div className="card-header">
							<h3 className="card-title">Panier</h3>
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
										<th>Promotion</th>
										<th>Total</th>
									</tr>
								</thead>
								<tbody>
									{data.map((produit, key) => (
										<tr id={key} key={key}>
											<td>{produit.nom}</td>
											<td>
												{parseFloat(
													produit.prix
												).toFixed(2)}{" "}
												MAD
											</td>
											<td>
												<input
													onChange={(e) =>
														setItemQuantity(
															produit.id,
															e.target.value
														)
													}
													value={produit.quantite}
													min={1}
													name={`produits[${key}][quantite]`}
													type="number"
													required
												/>
											</td>
											<td>
												{getPromotion(produit)
													? `${getPromotion(
															produit
													  )} %`
													: "Aucune"}
											</td>
											<td>
												{parseFloat(
													getTotal(produit)
												).toFixed(2)}{" "}
												MAD
											</td>
											<td>
												<button
													className="btn btn-danger btn-sm"
													type="button"
													onClick={() =>
														removeItem(produit.id)
													}
												>
													<i className="fas fa-trash"></i>
													&nbsp; Supprimer
												</button>
												<input
													type="hidden"
													name={`produits[${key}][id]`}
													defaultValue={produit.id}
													required
												/>
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
									justifyContent: "space-between",
									fontSize: 20,
								}}
							>
								<div>Total: </div>
								<div
									style={{
										fontWeight: "bold",
									}}
								>
									{parseFloat(total).toFixed(2)} MAD
								</div>
							</div>
						</div>
						{/* /.card-body */}
						{data.length > 0 && (
							<div className="card-footer">
								<div className="card">
									<div className="card-body">
										<div className="form-group">
											<label htmlFor="carte_fidelite">
												Carte fidélité
											</label>
											<input
												placeholder="Code de la carte fidélité"
												name="carte_fidelite"
												type="text"
												className="form-control"
												id="carte_fidelite"
												maxLength={13}
												required
											/>
										</div>
										{chequeCadeaux.length > 0 && (
											<div className="form-group">
												<label htmlFor={`code-0`}>
													{chequeCadeaux.length === 1
														? "Chèque cadeau"
														: "Chèques cadeaux"}
												</label>
												<div
													style={{
														display: "flex",
														flexDirection: "column",
													}}
												>
													{chequeCadeaux.map(
														(_field, index) => (
															<div
																key={index}
																className="input-group mb-3"
															>
																<input
																	type="text"
																	className="form-control"
																	id={`code-${index}`}
																	name="cheques_cadeaux[]"
																	required
																	maxLength={
																		13
																	}
																	placeholder="Code du chèque cadeau"
																	value={
																		chequeCadeaux[
																			index
																		]
																	}
																	onChange={(
																		event
																	) =>
																		handleInputChange(
																			index,
																			event
																		)
																	}
																/>
																<div className="input-group-append">
																	<span
																		className="input-group-text"
																		style={{
																			padding: 0,
																			margin: 0,
																		}}
																	>
																		<button
																			type="button"
																			className="btn btn-danger btn-sm"
																			onClick={() =>
																				handleRemoveField(
																					index
																				)
																			}
																		>
																			<i className="fa fa-minus" />
																		</button>
																	</span>
																</div>
															</div>
														)
													)}
												</div>
											</div>
										)}
										<div
											style={{
												display: "flex",
												justifyContent: "space-between",
											}}
										>
											<button
												type="button"
												className="btn btn-primary"
												onClick={handleAddField}
											>
												Nouveau chèque cadeau
											</button>
											<button
												type="submit"
												className="btn btn-success"
											>
												Valider
											</button>
										</div>
									</div>
								</div>
							</div>
						)}
					</div>
					{/* /.card */}
				</div>
			</div>
		</form>
	);
}

export default Cart;
