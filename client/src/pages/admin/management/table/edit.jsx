import { redirect, useLoaderData, useParams } from "react-router-dom";
import Content from "../../../../components/Content";
import Form from "../../../../components/form/Form";
import Header from "../../../../components/Header";
import { formDataToJson, snakeToCapitalCase } from "../../../../utils/format";
import { get, put } from "../../../../utils/requests";
import Table from "../../../../utils/config/Table";
import qs from "qs";

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
	let error = {};
	try {
		let response = await put(
			`http://localhost:8000/api/table/${params.name}/edit/${params.id}`,
			data
		);
		if (response.status !== 200 || response.data.status === "error") {
			alert(response.data.message);
			return response.data;
		} else {
			alert(response.data.message);
			return redirect("../");
		}
	} catch (e) {
		console.error(error);
		return error;
	}
};

export const loader = async ({ params }) => {
	try {
		const { id, name } = params;
		const data = (
			await get(`http://localhost:8000/api/table/${name}/${id}`)
		).data;

		const table = new Table(name);
		const dependenciesData = {
			internal: {},
			external: {},
		};

		const query = qs.stringify({
			where: {
				[name]: id,
			},
		});

		for (const dependency of table.getDependencies()) {
			dependenciesData.internal[dependency] = {
				data: (
					await get(
						`http://localhost:8000/api/table/${dependency}?${query}`
					)
				).data,
			};
		}

		for (const dependency of table.getExternalFields()) {
			dependenciesData.external[dependency] = {
				data: (
					await get(`http://localhost:8000/api/table/${dependency}`)
				).data,
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
	const { id, name } = useParams();
	links = {
		...links,
	};
	const title = snakeToCapitalCase(name);
	links[title] = `/admin/management/${name}`;
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
						name={name}
						submit={submit}
						method="put"
						action={`/admin/management/${name}/edit/${id}`}
						data={defaultData}
						dependenciesData={dependenciesData}
					/>
				)
			}
		></Content>
	);
}
