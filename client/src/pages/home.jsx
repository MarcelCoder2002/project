import { Outlet, useLoaderData } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useEffect, useRef } from "react";
import ControlSidebar from "../components/ControlSidebar";

import { get } from "../utils/requests";
import User from "../utils/config/User";
import Request from "../utils/config/Request";
import Domain from "../utils/config/Domain";
import qs from "qs";

import "../../plugins/jquery/jquery.min.js";
import "../../plugins/bootstrap/js/bootstrap.bundle.min.js";
import "../../assets/js/adminlte.min.js";
import { RequestContext } from "../hooks/useRequest.js";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import { PrimeReactProvider } from "primereact/api";
import { Toast } from "primereact/toast";
import { NotificationContext } from "../hooks/useNotification.js";
import { getBackendURL } from "../utils/url";

import config from "../config/config.json";

export const loader = async () => {
	const query = qs.stringify({
		includes: [
			{
				name: "notification",
				options: {
					update: window.location.pathname.endsWith("/notification"),
					order: [["dateCreation", "DESC"]],
				},
			},
		],
	});
	let user = null;
	try {
		const response = await get(getBackendURL(`/api/me?${query}`));
		if (
			!(
				response.status < 200 ||
				response.status >= 400 ||
				response.data.status === "error"
			)
		) {
			user = response.data;
		}
	} catch (e) {}
	let path = window.location.pathname;
	let base = `/${config?.server?.base?.replace(/\//, "") ?? ""}`;
	if (path === base) {
		path = "";
	} else {
		path = base.length === 1 ? path : path.replace(base, "");
		path = path.split("/")[0];
	}
	return new Request(new User(user), new Domain(path));
};

export default function Home() {
	const request = useLoaderData();
	const toast = useRef(null);

	useEffect(() => {
		$(function () {
			$('[data-widget="treeview"]').Treeview("init");
		});
	}, []);

	return (
		<PrimeReactProvider value={{ locale: "fr-MA" }}>
			<Toast ref={toast} />
			<NotificationContext.Provider value={toast.current}>
				{window.location.pathname.endsWith("/login") ? (
					<>
						{(() => {
							document.body.className =
								"hold-transition login-page";
						})()}
						<Outlet />
					</>
				) : (
					<RequestContext.Provider value={request}>
						{(() => {
							document.body.className =
								"hold-transition sidebar-mini layout-fixed";
						})()}
						<div className="wrapper">
							<Navbar />
							<Sidebar />
							<Outlet />
							<ControlSidebar />
							<Footer />
						</div>
					</RequestContext.Provider>
				)}
			</NotificationContext.Provider>
		</PrimeReactProvider>
	);
}
