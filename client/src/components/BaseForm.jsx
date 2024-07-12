import { useParams } from "react-router-dom";
import Field from "./Field";
import Table from "../utils/config/Table";

export default function BaseForm({
	name,
	dependenciesData,
	title,
	data = null,
}) {
	const table = new Table(name);
	const params = useParams();
	const primary = params.name ? params.name === name : true;

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
				{Array.from(table.getFieldObjects().values()).map(
					(field, key) =>
						field.isExternal() ? null : field.getName() ===
								table.getId() ||
						  field.getName() === params.name ? null : (
							<Field
								tableName={name}
								id={field.getName()}
								key={key}
								defaultValue={data?.[field.getName()]}
							/>
						)
				)}
				{table
					.getExternalFields()
					.map((field, key) =>
						field === params.name ? null : (
							<Field
								tableName={name}
								id={field}
								key={key}
								defaultValue={data?.[field]}
								selectOptions={
									dependenciesData.external[field].data ??
									null
								}
							/>
						)
					)}
			</div>
		</div>
	);
}
