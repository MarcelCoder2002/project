import {Route, Outlet, useRouteLoaderData, useNavigate} from "react-router-dom";
import Table, { Router as TableRouter } from "./table";
import Content from "../../../components/Content";
import Header from "../../../components/Header";
import {useEffect} from "react";

export function Router() {
	const links = {
		Administration: "/admin",
	};
	return (
		<>
			<Route
				index
				element={
					<Content
						header={<Header title="Gestion" links={links} />}
						main={<></>}
					/>
				}
			></Route>
			<Route path=":name" element={<Table />} errorElement={<></>}>
				{TableRouter({ links: links })}
			</Route>
		</>
	);
}

function Management() {
	const request = useRouteLoaderData("index");
	const navigate = useNavigate();

	useEffect(() => {
		if (
			!request.getUser().isAuthenticated() ||
			!request.getUser().getRoles().includes("ROLE_ADMIN")
		) {
			navigate("/admin/login");
		}
	}, []);

	return (
		<>
			<Outlet />
		</>
	);
}

export default Management;
