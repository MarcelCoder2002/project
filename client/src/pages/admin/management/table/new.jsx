import { redirect, useLoaderData, useParams } from "react-router-dom";
import Content from "../../../../components/Content";
import Form from "../../../../components/form/Form";
import Header from "../../../../components/Header";
import { formDataToJson, snakeToCapitalCase } from "../../../../utils/format";
import { get, post } from "../../../../utils/requests";
import Table from "../../../../utils/config/Table";
import { getBackendURL } from "../../../../utils/url";

export const action = async ({ request, params }) => {
	let data = {};
	const temp = formDataToJson(await request.formData());
	const list = Object.keys(temp);
	if (list.length === 1) {
		data = temp[params.name];
	} else {
		data.$dependencies = {};
		for (const o of list) {
			if (o === params.name) {
				data[o] = temp[o];
			} else {
				data.$dependencies[o] = temp[o];
			}
		}
	}
	let response = await post(
		getBackendURL(`/api/table/${params.name}/new`),
		data
	);
	if (response.status !== 200 || response.data.status === "error") {
		alert(response.data.message);
		return response.data;
	} else {
		alert(response.data.message);
		return redirect("../"); //`${window.location}`.split("/").slice(0, -1).join("/"));
	}
};

export async function loader({ params }) {
	const { name } = params;
	const table = new Table(name);

	const dependenciesData = {
		internal: {},
		external: {},
	};
	try {
		for (const dependency of table.getExternalFields()) {
			dependenciesData.external[dependency] = {
				data: (await get(getBackendURL(`/api/table/${dependency}`)))
					.data,
			};
		}

		return dependenciesData;
	} catch (error) {
		return redirect("/admin/login");
	}
}

export default function New({ links }) {
	links = {
		...links,
	};
	const { name } = useParams();
	const dependenciesData = useLoaderData();
	const title = snakeToCapitalCase(name);
	links[title] = `/admin/management/${name}`;

	return (
		<Content
			header={<Header title="Ajout" links={links} />}
			main={
				<Form
					title={`Ajouter ${title}`}
					name={name}
					submit="Ajouter"
					method="post"
					action={`/admin/management/${name}/new`}
					dependenciesData={dependenciesData}
				/>
			}
		></Content>
	);
}
