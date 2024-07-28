import { redirect, useLoaderData } from "react-router-dom";
import Content from "../../../components/Content.jsx";
import Form from "../../../components/form/Form.jsx";
import Header from "../../../components/Header.jsx";
import { formDataToJSON, parseKeyFormData } from "../../../utils/format.js";
import { get, post } from "../../../utils/requests.js";
import Table from "../../../utils/config/Table.js";
import { getBackendURL } from "../../../utils/url";

export const action = async ({ request }) => {
	const temp = parseKeyFormData(formDataToJSON(await request.formData()));
	let response = await post(
		getBackendURL(`/api/me/reclamation/new`),
		temp["reclamation"]
	);
	if (response.status !== 200 || response.data.status === "error") {
		alert(response.data.message);
		return response.data;
	} else {
		alert(response.data.message);
		return redirect("../");
	}
};

export async function loader() {
	const table = new Table("reclamation");

	const dependenciesData = {
		internal: {},
		external: {},
	};

	for (const dependency of table.getExternalFields()) {
		dependenciesData.external[dependency] = {
			data: (await get(getBackendURL(`/api/me/${dependency}`))).data,
		};
	}

	return dependenciesData;
}

export default function New({ links }) {
	const name = "reclamation";
	const dependenciesData = useLoaderData();
	links["Réclamation"] = `/profile/complaint`;

	return (
		<Content
			header={<Header title="Ajout" links={links} />}
			main={
				<Form
					title={`Ajouter une réclamation`}
					name={name}
					submit="Ajouter"
					method="post"
					action={`/profile/complaint/new`}
					dependenciesData={dependenciesData}
				/>
			}
		></Content>
	);
}
