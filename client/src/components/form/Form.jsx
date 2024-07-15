import { Form as _Form, Link } from "react-router-dom";
import Table from "../../utils/config/Table";
import BaseForm from "./BaseForm";
import { useContext } from "react";
import { RequestContext } from "../../hooks/useRequest";

export default function Form({
	name,
	dependenciesData,
	title,
	submit,
	data = null,
	...props
}) {
	const table = new Table(name);
	const dependencies = Array.from(table.getDependencyObjects().values());
	const action = props.method === "post" ? "new" : "edit";
	const request = useContext(RequestContext);
	const hasInternal = table.hasDependencyFormForUserAndAction(
		request.getUser(),
		action
	);

	return (
		<_Form style={{ padding: 0, margin: 0 }} {...props}>
			<div className="row">
				<div className={`col-md-${hasInternal ? 6 : 12}`}>
					<BaseForm
						name={name}
						title={title}
						data={data}
						dependenciesData={dependenciesData}
						action={action}
					/>
				</div>
				{!hasInternal ? null : (
					<div className="col-md-6">
						{dependencies.map((dependency, key) => (
							<BaseForm
								key={key}
								name={dependency.getName()}
								title={dependency.getFormTitle()}
								data={
									dependenciesData.internal[
										dependency.getName()
									]?.data?.[0] ?? null
								}
								action={action}
							/>
						))}
					</div>
				)}
			</div>
			<div className="row" style={{ paddingBottom: 10 }}>
				<div className="col-12">
					<Link to="../" className="btn btn-secondary">
						Retour
					</Link>
					<button
						type="submit"
						className="btn btn-success float-right"
					>
						{submit}
					</button>
				</div>
			</div>
		</_Form>
	);
}
