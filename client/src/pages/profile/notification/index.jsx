import Content from "../../../components/Content.jsx";
import Header from "../../../components/Header.jsx";
import DataTable from "../../../components/DataTable.jsx";
import { useContext } from "react";
import { RequestContext } from "../../../hooks/useRequest.js";
import { NavLink, Outlet, Route, useLoaderData } from "react-router-dom";
import { action as deleteAction } from "./delete";

export function Router() {
	const links = {
		Profile: "/profile",
	};
	return (
		<>
			<Route index element={<Main links={links} />}></Route>
			<Route path="delete/:id" action={deleteAction}></Route>
		</>
	);
}

function Main({ links }) {
	const request = useContext(RequestContext);
	const actions = request.getUser().getTableActions("notification");
	return (
		<>
			<Content
				header={<Header title="Notifications" links={links} />}
				main={
					<>
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
							tableName="notification"
							actions={actions}
							rows={request
								.getUser()
								.getIncludesData("notification")}
						/>
					</>
				}
			/>
		</>
	);
}

function Notification() {
	return <Outlet />;
}

export default Notification;
