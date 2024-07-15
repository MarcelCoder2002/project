import React, { useContext } from "react";
import "../../../plugins/jquery/jquery.min.js";
import "../../../plugins/bootstrap/js/bootstrap.bundle.min.js";
import "../../../plugins/chart.js/Chart.min.js";
import "../../../dist/js/adminlte.min.js";
import { NavLink, redirect, useLoaderData } from "react-router-dom";
import Header from "../../components/Header.jsx";
import Content from "../../components/Content.jsx";
import Box from "../../components/statistics/Box.jsx";
import { get } from "../../utils/requests.js";
import qs from "qs";
import Card from "../../components/Card.jsx";
import DataTable from "../../components/DataTable.jsx";
import { RequestContext } from "../../hooks/useRequest.js";

export const loader = async ({}) => {
	const query = qs.stringify({
		include: ["carte_fidelite", "cheque_cadeau"],
	});
	try {
		return (await get(`http://localhost:8000/api/me?${query}`)).data;
	} catch (error) {
		return redirect("/profile/login");
	}
};

function Home() {
	const request = useContext(RequestContext);
	const actions = request.getUser().getTableActions("cheque_cadeau");
	const data = useLoaderData();
	const dependencies = data.includes;

	const carte_fidelite = dependencies.carte_fidelite[0];
	const cheques_cadeau = dependencies.cheque_cadeau;

	const cheques_cadeau_cumul = cheques_cadeau.length;
	const cheques_cadeau_consomme = cheques_cadeau.filter(
		(cheque_cadeau) => cheque_cadeau.statut === "Consommé"
	).length;
	const cheques_cadeau_recupere = cheques_cadeau.filter(
		(cheque_cadeau) => cheque_cadeau.statut === "Récupéré"
	).length;
	const cheques_cadeau_expire = cheques_cadeau.filter(
		(cheque_cadeau) => cheque_cadeau.statut === "Expiré"
	).length;
	const cheques_cadeau_en_attente = cheques_cadeau.filter(
		(cheque_cadeau) => cheque_cadeau.statut === "En attente"
	).length;

	const points_cumul = cheques_cadeau_cumul * 10_000 + carte_fidelite.point;
	const points_consomme = cheques_cadeau_consomme * 10_000;
	const points_recupere = cheques_cadeau_recupere * 10_000;
	const points_expire = cheques_cadeau_expire * 10_000;
	const points_en_attente = cheques_cadeau_en_attente * 10_000;

	return (
		<Content
			header={<Header title="Profile" links={{}} />}
			main={
				<div className="container-fluid">
					<div className="row">
						<Card title="Carte Fidélité" type="danger" width={4}>
							<div className="row">
								<div
									className="col-lg-3 col-6"
									style={{ minWidth: 450 }}
								>
									<div
										className="small-box bg-gradient-danger"
										style={{ minHeight: 250 }}
									>
										<div className="inner">
											<h3 style={{ marginBottom: 40 }}>
												{carte_fidelite.point}
												<sup style={{ fontSize: 20 }}>
													&nbsp;&nbsp;
													{carte_fidelite.reste
														.toString()
														.substring(1)}
												</sup>
											</h3>
											<div
												className=""
												style={{
													padding: 10,
													marginBottom: 20,
													fontSize: 20,
													fontWeight: "bold",
													letterSpacing: 3,
													backgroundColor:
														"#000000b3",
												}}
											>
												{carte_fidelite.code}
											</div>
											<p style={{ marginBottom: 20 }}>
												<span
													style={{
														textDecoration:
															"underline",
													}}
												>
													Titulaire :
												</span>
												<span
													style={{
														fontWeight: "bold",
													}}
												>
													&nbsp;&nbsp;&nbsp;
													{request
														.getUser()
														.getFullName()}
												</span>
											</p>

											<div
												style={{
													textAlign: "end",
												}}
											>
												<img
													width={150}
													alt="Code barre"
													src={`https://barcode.tec-it.com/barcode.ashx?data=${carte_fidelite.code}&code=Code128&multiplebarcodes=true&translate-esc=on&dmsize=Default&eclevel=L`}
												/>
											</div>
										</div>
										<div className="icon">
											<i className="fas fa-credit-card" />
										</div>
									</div>
								</div>
							</div>
						</Card>
					</div>
					<div className="row">
						<Card
							title="Carte fidélité (points)"
							type="warning"
							closed={true}
							width={4}
						>
							<div className="row">
								<Box
									title="Cumul"
									icon="fas fa-credit-card"
									type="warning"
									value={points_cumul}
								/>
								<Box
									title="Total consommé"
									icon="fas fa-credit-card"
									type="warning"
									value={points_consomme}
								/>
								<Box
									title="Total expiré"
									icon="fas fa-credit-card"
									type="warning"
									value={points_expire}
								/>
								<Box
									title="Total récupéré"
									icon="fas fa-credit-card"
									type="warning"
									value={points_recupere}
								/>
							</div>
							<div className="row">
								<Box
									title="En attente"
									icon="fas fa-credit-card"
									type="warning"
									value={points_en_attente}
								/>
							</div>
						</Card>
					</div>
					<div className="row">
						<Card
							title="Chèques cadeau (nombres)"
							type="success"
							closed={true}
							width={4}
						>
							<div className="row">
								<Box
									title="Cumul"
									icon="fas fa-gift"
									type="success"
									value={cheques_cadeau_cumul}
								/>
								<Box
									title="Total consommé"
									icon="fas fa-gift"
									type="success"
									value={cheques_cadeau_consomme}
								/>
								<Box
									title="Total expiré"
									icon="fas fa-gift"
									type="success"
									value={cheques_cadeau_expire}
								/>
								<Box
									title="Total récupéré"
									icon="fas fa-gift"
									type="success"
									value={cheques_cadeau_recupere}
								/>
							</div>
							<div className="row">
								<Box
									title="En attente"
									icon="fas fa-gift"
									type="success"
									value={cheques_cadeau_en_attente}
								/>
							</div>
						</Card>
					</div>
					<div className="row">
						<Card
							title="Liste des chèques cadeau"
							type="primary"
							width={4}
							closed={true}
						>
							{!actions.includes("new") ? null : (
								<NavLink
									to="new"
									className="btn btn-primary"
									style={{ marginBottom: 20 }}
								>
									Ajouter
								</NavLink>
							)}
							<DataTable
								tableName="cheque_cadeau"
								actions={actions}
								rows={cheques_cadeau}
							/>
						</Card>
					</div>
				</div>
			}
		/>
	);
}

export default Home;
