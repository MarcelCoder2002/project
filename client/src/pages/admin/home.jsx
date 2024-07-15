import React, { useContext, useEffect } from "react";
import "../../../plugins/jquery/jquery.min.js";
import "../../../plugins/bootstrap/js/bootstrap.bundle.min.js";
import "../../../plugins/chart.js/Chart.min.js";
import "../../../dist/js/adminlte.min.js";
import { Route, useNavigate } from "react-router-dom";
import Management, { Router as ManagementRouter } from "./management/index.jsx";
import Content from "../../components/Content.jsx";
import Header from "../../components/Header.jsx";
import { RequestContext } from "../../hooks/useRequest.js";

export async function loader({ params }) {
	return {};
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
	return (
		<Content
			header={<Header title="Administration" links={{}} />}
			main={<></>}
		/>
	);
}

export default Home;
