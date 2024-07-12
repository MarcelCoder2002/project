import React, { useEffect } from "react";
import Links from "../../components/Links.jsx";
import Navbar from "../../components/Navbar.jsx";
import Sidebar from "../../components/Sidebar.jsx";

import "../../../plugins/jquery/jquery.min.js";
import "../../../plugins/bootstrap/js/bootstrap.bundle.min.js";
import "../../../plugins/chart.js/Chart.min.js";
import "../../../dist/js/adminlte.min.js";
import {
	Outlet,
	Route,
	useNavigate,
	useRouteLoaderData,
} from "react-router-dom";
import User from "../../utils/config/User.js";

export async function loader({ params }) {
	return {};
}

export function Router() {
	return (
		<>
			<Route path=""></Route>
		</>
	);
}

function Home() {
	useEffect(() => {
		document.body.className = "hold-transition sidebar-mini layout-fixed";
		$(function () {
			$('[data-widget="treeview"]').Treeview("init");
		});
	}, []);
	const data = useRouteLoaderData("index");
	const navigate = useNavigate();
	if (!data || !data.roles.includes("ROLE_CLIENT")) {
		navigate("/profile/login");
	}

	const user = new User(data);

	return (
		<>
			<Links></Links>
			<div className="wrapper">
				{!user ? (
					<p>Chargement...</p>
				) : (
					<>
						<Navbar></Navbar>
						<Sidebar title="Profile" user={user}></Sidebar>
						<Outlet />
					</>
				)}
			</div>
		</>
	);
}

export default Home;
