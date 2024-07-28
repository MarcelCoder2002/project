import { redirect, useLoaderData, useParams } from "react-router-dom";
import Content from "../../../components/Content";
import Form from "../../../components/form/Form";
import Header from "../../../components/Header";
import {
	formDataToJSON,
	parseKeyFormData,
	snakeToCapitalCase,
} from "../../../utils/format";
import { get, put } from "../../../utils/requests";
import Table from "../../../utils/config/Table";
import qs from "qs";
import { getBackendURL } from "../../../utils/url";

export const action = async ({ request, params }) => {
	let data = {};
	const temp = parseKeyFormData(formDataToJSON(await request.formData()));
	const list = Object.keys(temp);
	if (list.length === 1) {
		data = temp["cheque_cadeau"];
	} else {
		data.$dependencies = {};
		for (const o of list) {
			if (o === "cheque_cadeau") {
				data[o] = temp[o];
			} else {
				data.$dependencies[o] = temp[o];
			}
		}
	}
	let error = {};
	try {
		let response = await put(
			getBackendURL(`/api/table/cheque_cadeau/edit/${params.id}`),
			data
		);
		if (response.status !== 200 || response.data.status === "error") {
			alert(response.data.message);
			return response.data;
		} else {
			alert(response.data.message);
			return redirect(
				"../"
				// `${window.location}`.split("/").slice(0, -2).join("/")
			);
		}
	} catch (e) {
		console.error(error);
		return error;
	}
};

export const loader = async ({ params }) => {
	try {
		const { id } = params;
		const data = (
			await get(getBackendURL(`/api/table/cheque_cadeau/${id}`))
		).data;

		const table = new Table("cheque_cadeau");
		const dependenciesData = {
			internal: {},
			external: {},
		};

		const query = qs.stringify({
			where: {
				cheque_cadeau: id,
			},
		});

		for (const dependency of table.getDependencies()) {
			dependenciesData.internal[dependency] = {
				data: (
					await get(
						getBackendURL(`/api/table/${dependency}?${query}`)
					)
				).data,
			};
		}

		for (const dependency of table.getExternalFields()) {
			dependenciesData.external[dependency] = {
				data: (await get(getBackendURL(`/api/table/${dependency}`)))
					.data,
			};
		}

		return {
			defaultData: data,
			dependenciesData: dependenciesData,
		};
	} catch (error) {
		return redirect("/admin/login");
	}
};

export default function Edit({ links }) {
	const { defaultData, dependenciesData } = useLoaderData();
	const { id } = useParams();
	links = {
		...links,
	};
	const title = snakeToCapitalCase("cheque_cadeau");
	links[title] = `admin/gifts`;
	const submit = "Modifier";

	return (
		<Content
			header={<Header title="Modification" links={links} />}
			main={
				!defaultData ? (
					<p>Chargement...</p>
				) : (
					<Form
						title={`${submit} ${title}`}
						name="cheque_cadeau"
						submit={submit}
						method="put"
						action={`/admin/gifts/edit/${id}`}
						data={defaultData}
						dependenciesData={dependenciesData}
					/>
				)
			}
		></Content>
	);
}
