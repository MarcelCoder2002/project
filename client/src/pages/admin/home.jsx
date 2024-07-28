import React from "react";
import { Chart } from "primereact/chart";
import "../../../plugins/jquery/jquery.min.js";
import "../../../plugins/bootstrap/js/bootstrap.bundle.min.js";
import "../../../plugins/chart.js/Chart.min.js";
import "../../../assets/js/adminlte.min.js";
import { redirect, Route, useLoaderData } from "react-router-dom";
import Management, { Router as ManagementRouter } from "./management/index.jsx";
import Content from "../../components/Content.jsx";
import Header from "../../components/Header.jsx";
import Box from "../../components/statistics/Box.jsx";
import Card from "../../components/Card.jsx";
import { get } from "../../utils/requests.js";
import Gifts, {
	Router as GiftsRouter,
	loader as giftsLoader,
} from "./gifts/index.jsx";
import Checkout from "./checkout.jsx";
import { capitalize } from "../../utils/format.js";
import { getBackendURL } from "../../utils/url";

export async function loader({}) {
	try {
		return {
			statistics: (await get(getBackendURL(`/api/table/statistics`)))
				.data,
		};
	} catch (error) {
		return redirect("/admin/login");
	}
}

export function Router(links) {
	return (
		<>
			<Route path="management" element={<Management />}>
				{ManagementRouter(links)}
			</Route>
			<Route path="gifts" element={<Gifts />} loader={giftsLoader}>
				{GiftsRouter(links)}
			</Route>
			<Route path="checkout" element={<Checkout links={links} />}></Route>
		</>
	);
}

const STATUT = {
	EN_ATTENTE: "En attente",
	RECUPERE: "Récupéré",
	CONSOMME: "Consommé",
	EXPIRE: "Expiré",
};

const getTypeValue = (array, type) => {
	return array
		?.filter((value) => value.type === type)
		?.map((value) => value.value);
};

const getMonthFromDate = (date) =>
	capitalize(
		new Intl.DateTimeFormat("fr-FR", {
			month: "long",
		}).format(new Date(date))
	);

function Home() {
	const { statistics } = useLoaderData();
	console.log(statistics);

	const months = statistics.client.monthlySignups.map((o) =>
		getMonthFromDate(o.label)
	);

	//
	const baseChartDatasetConfig = {
		backgroundColor: "rgba(60,141,188,0.9)",
		borderColor: "rgba(60,141,188,0.8)",
		pointRadius: false,
		pointColor: "#3b8bba",
		pointStrokeColor: "rgba(60,141,188,1)",
		pointHighlightFill: "#fff",
		pointHighlightStroke: "rgba(60,141,188,1)",
	};

	const baseChartOptions = {
		responsive: true,
		maintainAspectRatio: false,
		datasetFill: false,
	};

	// client
	var barChartDataClient = {
		labels: months,
		datasets: [
			{
				...baseChartDatasetConfig,
				label: "Inscriptions",
				data: statistics.client.monthlySignups.map((o) => o.value),
			},
		],
	};

	// achat
	var barChartDataAchat = {
		labels: months,
		datasets: [
			{
				...baseChartDatasetConfig,
				label: "Revenue",
				data: statistics.achat.monthlyRevenue.map((o) => o.value),
			},
		],
	};

	// gifts
	var barChartDataGifts = {
		labels: months,
		datasets: [
			{
				...baseChartDatasetConfig,
				label: STATUT.EN_ATTENTE,
				data: getTypeValue(
					statistics.cheque_cadeau.groupedGiftCards,
					STATUT.EN_ATTENTE
				),
				backgroundColor: "#ffc107",
			},
			{
				...baseChartDatasetConfig,
				label: STATUT.RECUPERE,
				data: getTypeValue(
					statistics.cheque_cadeau.groupedGiftCards,
					STATUT.RECUPERE
				),
				backgroundColor: "#17a2b8",
			},
			{
				...baseChartDatasetConfig,
				label: STATUT.CONSOMME,
				data: getTypeValue(
					statistics.cheque_cadeau.groupedGiftCards,
					STATUT.CONSOMME
				),
				backgroundColor: "#28a745",
			},
			{
				...baseChartDatasetConfig,
				label: STATUT.EXPIRE,
				data: getTypeValue(
					statistics.cheque_cadeau.groupedGiftCards,
					STATUT.EXPIRE
				),
				backgroundColor: "#dc3545",
			},
		],
	};

	return (
		<Content
			header={<Header title="Administration" links={{}} />}
			main={
				<div className="container-fluid">
					<div className="row">
						<Card title="" type="secondary" width={4}>
							<div className="row">
								<Box
									title="Nombre de clients"
									type="danger"
									icon="fas fa-user-plus"
									value={statistics.client.count}
								/>
							</div>
						</Card>
					</div>
					<div className="row"></div>
					<div className="row">
						<Card title="Statistiques" type="primary" width={4}>
							<div className="row">
								<div
									className="col-lg-6 col-6"
									style={{
										textAlign: "center",
										marginBottom: 20,
									}}
								>
									<Chart
										type="line"
										data={barChartDataClient}
										options={baseChartOptions}
										style={{ minHeight: 300 }}
									/>
									<h3>Clients</h3>
								</div>
								<div
									className="col-lg-6 col-6"
									style={{ textAlign: "center" }}
								>
									<Chart
										type="bar"
										data={barChartDataAchat}
										options={baseChartOptions}
										style={{ minHeight: 300 }}
									/>
									<h3>Chiffre d'affaire</h3>
								</div>
							</div>
							<div className="row">
								<div
									className="col-lg-6 col-6"
									style={{ textAlign: "center" }}
								>
									<Chart
										type="bar"
										data={barChartDataGifts}
										options={baseChartOptions}
										style={{ minHeight: 300 }}
									/>
									<h3>Chèques cadeau</h3>
								</div>
							</div>
						</Card>
					</div>
					<div className="row"></div>
				</div>
			}
		/>
	);
}

export default Home;
