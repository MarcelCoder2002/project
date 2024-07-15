import { Route, Outlet } from "react-router-dom";
import Table, { Router as TableRouter } from "./table";
import Content from "../../../components/Content";
import Header from "../../../components/Header";

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
	return (
		<>
			<Outlet />
		</>
	);
}

export default Management;
