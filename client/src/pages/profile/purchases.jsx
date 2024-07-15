import Content from "../../components/Content.jsx";
import Header from "../../components/Header.jsx";
import DataTable from "../../components/DataTable.jsx";
import { useContext } from "react";
import { RequestContext } from "../../hooks/useRequest.js";
import { get } from "../../utils/requests.js";
import qs from "qs";
import { NavLink, useLoaderData } from "react-router-dom";

export const loader = async ({ params }) => {
	try {
		return (await get(`http://localhost:8000/api/me/purchases`)).data;
	} catch (error) {
		return redirect("/profile/login");
	}
};

export function Purchases({ links }) {
	const request = useContext(RequestContext);
	const data = useLoaderData();
	const actions = request.getUser().getTableActions("achat");
	return (
		<>
			<Content
				header={<Header title="Achats" links={links} />}
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
							tableName="achat"
							actions={actions}
							rows={data}
						/>
					</>
				}
			/>
		</>
	);
}

export default Purchases;
