import { Form, redirect, useLoaderData, useParams } from "react-router-dom";
import Content from "../../../../components/Content";
import Header from "../../../../components/Header";
import {
	formatDatetime,
	formDataToJson,
	snakeToCapitalCase,
} from "../../../../utils/format";
import { get, post } from "../../../../utils/requests";
import User from "../../../../utils/config/User";
import useRequest from "../../../../hooks/useRequest";
import qs from "qs";
import { Fragment } from "react";
import { getBackendURL } from "../../../../utils/url";

export const loader = async ({ params }) => {
	let data = null;
	try {
		switch (params.name) {
			case "reclamation":
				data = (
					await get(
						getBackendURL(
							`/api/table/reclamation/${params.id}?${qs.stringify(
								{
									includes: [
										{
											name: "message",
											options: {
												includes: ["admin"],
												update: true,
											},
										},
										"client",
									],
								}
							)}`
						)
					)
				).data;
				break;

			default:
				data = (
					await get(
						getBackendURL(`/api/table/${params.name}/${params.id}`)
					)
				).data;
				break;
		}
	} catch (error) {
		return redirect("/admin/login");
	}

	return data;
};

export const action = async ({ request }) => {
	try {
		const data = formDataToJson(await request.formData());
		const message = (
			await post(getBackendURL(`/api/table/message/new`), {
				...data,
				msg: {
					src: "admin",
					dst: "client",
				},
			})
		).data;

		const user = new User(message.admin);
	} catch (error) {
		console.log(error);
	}
	return null;
};

export default function Show({ links }) {
	const data = useLoaderData();
	const request = useRequest();
	const { id, name } = useParams();

	let currentUser = null;
	let isClient = true;

	links = {
		...links,
	};

	const title = snakeToCapitalCase(name);
	links[title] = `/admin/management/${name}`;
	let main = <></>;

	const client = new User(data.includes.client);

	switch (name) {
		case "reclamation":
			main = (
				<div className="card direct-chat direct-chat-primary">
					<div className="card-header">
						<h3 className="card-title">{data.objet}</h3>
						<div className="card-tools">
							<button
								type="button"
								className="btn btn-tool"
								data-card-widget="collapse"
							>
								<i className="fas fa-minus" />
							</button>
						</div>
					</div>
					<div className="card-body">
						<div
							className="direct-chat-messages"
							style={{ minHeight: 500 }}
						>
							<div className="direct-chat-msg">
								<div className="direct-chat-infos clearfix">
									<span className="direct-chat-name float-left">
										{client.getFullName()}
									</span>
									<span className="direct-chat-timestamp float-right">
										{formatDatetime(data.dateCreation)}
									</span>
								</div>
								<img
									className="direct-chat-img"
									src={client.getImage()}
									alt="message user image"
								/>
								<div className="direct-chat-text">
									{data.contenu}
								</div>
							</div>
							{data.includes.message.map((message, key) => (
								<Fragment key={key}>
									{(() => {
										isClient = !!message.client;
										currentUser = !isClient
											? request.getUser()
											: client;
									})()}
									<div
										className={`direct-chat-msg${
											!isClient ? " right" : ""
										}`}
									>
										<div className="direct-chat-infos clearfix">
											<span
												className={`direct-chat-name float-${
													!isClient ? "right" : "left"
												}`}
											>
												{!isClient
													? "Vous"
													: currentUser.getFullName()}
											</span>
											<span
												className={`direct-chat-timestamp float-${
													!isClient ? "left" : "right"
												}`}
											>
												{formatDatetime(
													message.dateCreation
												)}
											</span>
										</div>
										<img
											className="direct-chat-img"
											src={currentUser.getImage()}
											alt="message user image"
										/>
										<div className="direct-chat-text">
											{message.message}
										</div>
									</div>
								</Fragment>
							))}
						</div>
					</div>
					<div className="card-footer">
						<Form
							action={`/admin/management/reclamation/show/${data.id}`}
							method="post"
						>
							<input
								type="hidden"
								name="reclamation"
								value={data.id}
								required
							/>
							<input
								type="hidden"
								name="admin"
								value={request.getUser().getId()}
								required
							/>
							<div className="input-group">
								<input
									type="text"
									name="message"
									placeholder="Saisir le message ..."
									className="form-control"
									required
								/>
								<span className="input-group-append">
									<button
										type="submit"
										className="btn btn-primary"
									>
										Envoyer
									</button>
								</span>
							</div>
						</Form>
					</div>
					{/* /.card-footer*/}
				</div>
			);
			break;
	}

	return (
		<Content
			header={<Header title="Informations" links={links} />}
			main={main}
		></Content>
	);
}
