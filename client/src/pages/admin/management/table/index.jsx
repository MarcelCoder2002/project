import Content from "../../../../components/Content";
import Header from "../../../../components/Header";
import {
	Route,
	useParams,
	Outlet,
	NavLink,
	useLoaderData,
	useRouteLoaderData,
} from "react-router-dom";
import DataTable from "../../../../components/DataTable";
import { snakeToCapitalCase } from "../../../../utils/format";

import Show, { loader as showLoader } from "./show";
import Edit, { action as editAction, loader as editLoader } from "./edit";
import New, { action as newAction, loader as newLoader } from "./new";
import { action as deleteAction } from "./delete";
import { get } from "../../../../utils/requests";
import Table_ from "../../../../utils/config/Table";
import { useContext } from "react";
import { RequestContext } from "../../../../hooks/useRequest";

export const loader = async ({ params }) => {
	try {
		return (await get(`http://localhost:8000/api/table/${params.name}`))
			.data;
	} catch (error) {
		return redirect("/admin/login");
	}
};

export function Router({ links }) {
	links = {
		...links,
		Gestion: "/admin/management",
	};

	return (
		<>
			<Route
				index
				loader={loader}
				element={<Main links={links} />}
			></Route>
			<Route
				path="new"
				element={<New links={links} />}
				loader={newLoader}
				action={newAction}
			></Route>
			<Route
				path="show/:id"
				element={<Show links={links} />}
				loader={showLoader}
			></Route>
			<Route
				path="edit/:id"
				element={<Edit links={links} />}
				loader={editLoader}
				action={editAction}
			></Route>
			<Route path="delete/:id" action={deleteAction}></Route>
		</>
	);
}

function Main({ links }) {
	const { name } = useParams();
	const title = snakeToCapitalCase(name);
	const data = useLoaderData();
	const request = useContext(RequestContext);
	const actions = request.getUser().getTableActions(name);

	if (!Table_.getTables().includes(name)) {
		throw new Error("error");
	}

	return (
		<Content
			header={<Header title={title} links={links} />}
			main={
				!data ? (
					<p>Chargement...</p>
				) : (
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
						<DataTable rows={data} actions={actions} />
					</>
				)
			}
		/>
	);
}

function Table() {
	return (
		<>
			<Outlet />
		</>
	);
}

export default Table;
