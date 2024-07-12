import { Outlet, useLocation, useRouteLoaderData } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useEffect } from "react";
import ControlSidebar from "../components/ControlSidebar";

import "../../plugins/jquery/jquery.min.js";
import "../../plugins/bootstrap/js/bootstrap.bundle.min.js";
import "../../dist/js/adminlte.min.js";
import {RequestContext} from "../hooks/useRequest.js";

export default function Home() {
	const location = useLocation();
	const request = useRouteLoaderData("index");
	document.body.className = "hold-transition sidebar-mini layout-fixed";

	useEffect(() => {
		$(function () {
			$('[data-widget="treeview"]').Treeview("init");
		});
	}, []);

	return (
		<>
			{location.pathname.endsWith("login") ? (
				<Outlet />
			) : (
				<RequestContext.Provider value={request}>
					<div className="wrapper">
						<Navbar />
						<Sidebar/>
						<Outlet />
						<ControlSidebar />
						<Footer />
					</div>
				</RequestContext.Provider>
			)}
		</>
	);
}
