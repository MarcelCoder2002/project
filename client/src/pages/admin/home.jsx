import React, { useContext, useEffect } from "react";
import "../../../plugins/jquery/jquery.min.js";
import "../../../plugins/bootstrap/js/bootstrap.bundle.min.js";
import "../../../plugins/chart.js/Chart.min.js";
import "../../../dist/js/adminlte.min.js";
import { redirect, Route, useLoaderData } from "react-router-dom";
import Management, { Router as ManagementRouter } from "./management/index.jsx";
import Content from "../../components/Content.jsx";
import Header from "../../components/Header.jsx";
import Box from "../../components/statistics/Box.jsx";
import Card from "../../components/Card.jsx";
import { get } from "../../utils/requests.js";

export async function loader({}) {
	try {
		return (await get(`http://localhost:8000/api/table/client`)).data;
	} catch (error) {
		return redirect("/admin/login");
	}
}

export function Router() {
	return (
		<>
			<Route path="management" element={<Management />}>
				{ManagementRouter()}
			</Route>
		</>
	);
}

function Home() {
	const data = useLoaderData();
	return (
		<Content
			header={<Header title="Administration" links={{}} />}
			main={
				<div className="container-fluid">
					<div className="row">
						<Card title="Carte Fidélité" type="danger" width={4}>
							<div className="row">
								<Box
									title="Nombre de clients"
									type="danger"
									icon="fas fa-user-plus"
									value={data.length}
								/>
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
