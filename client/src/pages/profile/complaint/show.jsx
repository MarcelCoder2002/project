import { Form, useLoaderData } from "react-router-dom";
import Content from "../../../components/Content";
import Header from "../../../components/Header";
import { get, post } from "../../../utils/requests";
import qs from "qs";
import useRequest from "../../../hooks/useRequest";
import { formatDatetime, formDataToJson } from "../../../utils/format";
import User from "../../../utils/config/User";
import { Fragment } from "react";
import { getBackendURL } from "../../../utils/url";

export const loader = async ({ params }) => {
	const data = (
		await get(
			getBackendURL(
				`/api/me/reclamation/${params.id}?${qs.stringify({
					includes: [
						{
							name: "message",
							options: { includes: ["admin"], update: true },
						},
					],
				})}`
			)
		)
	).data;
	return data;
};

export const action = async ({ request }) => {
	try {
		const data = formDataToJson(await request.formData());
		const message = (
			await post(getBackendURL(`/api/me/message/new`), {
				...data,
				msg: {
					src: "client",
					dst: "admin",
				},
			})
		).data;

		const user = new User(message.client);
	} catch (error) {
		console.log(error);
	}
	return null;
};

export default function Show({ links }) {
	const request = useRequest();
	const data = useLoaderData();
	let currentUser = null;
	let isClient = true;

	links["Réclamations"] = "/profile/complaint";
	return (
		<Content
			header={<Header title="Message" links={links}></Header>}
			main={
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
							<div className="direct-chat-msg right">
								<div className="direct-chat-infos clearfix">
									<span className="direct-chat-name float-right">
										Vous
									</span>
									<span className="direct-chat-timestamp float-left">
										{formatDatetime(data.dateCreation)}
									</span>
								</div>
								<img
									className="direct-chat-img"
									src={request.getUser().getImage()}
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
										currentUser = isClient
											? request.getUser()
											: new User(message.admin);
									})()}
									<div
										className={`direct-chat-msg${
											isClient ? " right" : ""
										}`}
									>
										<div className="direct-chat-infos clearfix">
											<span
												className={`direct-chat-name float-${
													isClient ? "right" : "left"
												}`}
											>
												{isClient ? "Vous" : "Admin"}
											</span>
											<span
												className={`direct-chat-timestamp float-${
													isClient ? "left" : "right"
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
							action={`/profile/complaint/show/${data.id}`}
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
								name="client"
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
			}
		/>
	);
}
