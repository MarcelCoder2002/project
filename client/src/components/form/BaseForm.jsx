import { useParams } from "react-router-dom";
import Field from "./Field";
import Table from "../../utils/config/Table";
import { useContext } from "react";
import { RequestContext } from "../../hooks/useRequest";

export default function BaseForm({
	name,
	dependenciesData,
	title,
	action,
	data = null,
}) {
	const table = new Table(name);
	const params = useParams();
	const primary = params.name ? params.name === name : true;
	const request = useContext(RequestContext);
	const fields = table.getVisibleFieldsInFormForUserAndAction(
		request.getUser(),
		action
	);

	return (
		<div className={`card card-${primary ? "primary" : "secondary"}`}>
			<div className="card-header">
				<h3 className="card-title">{title}</h3>
				<div className="card-tools">
					<button
						type="button"
						className="btn btn-tool"
						data-card-widget="collapse"
						title="Collapse"
					>
						<i className="fas fa-minus"></i>
					</button>
				</div>
			</div>
			<div className="card-body">
				{fields.map((field, key) =>
					field.isExternal() ? (
						<Field
							tableName={name}
							id={field.getName()}
							key={key}
							defaultValue={data?.[field.getName()]}
							selectOptions={
								dependenciesData.external[field.getName()]
									.data ?? null
							}
							action={action}
						/>
					) : (
						<Field
							tableName={name}
							id={field.getName()}
							key={key}
							defaultValue={data?.[field.getName()]}
							action={action}
						/>
					)
				)}
			</div>
		</div>
	);
}
