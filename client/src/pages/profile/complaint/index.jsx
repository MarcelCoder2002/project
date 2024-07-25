import Content from "../../../components/Content.jsx";
import Header from "../../../components/Header.jsx";
import DataTable from "../../../components/DataTable.jsx";
import { useContext } from "react";
import { RequestContext } from "../../../hooks/useRequest.js";
import { get } from "../../../utils/requests.js";
import qs from "qs";
import { NavLink, Outlet, Route, useLoaderData } from "react-router-dom";
import New, { action as newAction, loader as newLoader } from "./new.jsx";

export const loader = async ({ params }) => {
	const query = qs.stringify({
		includes: ["reclamation"],
	});
	try {
		return (await get(`http://localhost:8000/api/me?${query}`)).data;
	} catch (error) {
		return redirect("/profile/login");
	}
};

export function Router() {
	const links = {
		Profile: "/profile",
	};
	return (
		<>
			<Route
				index
				element={<Main links={links} />}
				loader={loader}
			></Route>
			<Route
				path="new"
				element={<New links={links} />}
				action={newAction}
				loader={newLoader}
			></Route>
		</>
	);
}

export function Main({ links }) {
	const request = useContext(RequestContext);
	const data = useLoaderData();
	const actions = request.getUser().getTableActions("reclamation");
	return (
		<>
			<Content
				header={<Header title="Réclamations" links={links} />}
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
							tableName="reclamation"
							actions={actions}
							rows={data.includes.reclamation}
						/>
					</>
				}
			/>
		</>
	);
}

function Complaint() {
	return <Outlet />;
}

export default Complaint;
