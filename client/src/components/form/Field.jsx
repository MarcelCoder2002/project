import { formatDateForInput, formatOption } from "../../utils/format";
import Table from "../../utils/config/Table";

export default function Field({
	tableName,
	id,
	action,
	placeholder = "",
	defaultValue = null,
	multiple = false,
	selectOptions = null,
	step = "any",
	...props
}) {
	const name = id;
	const field = Table.getField(tableName, name);
	const fieldName = `${tableName}[${name}]`;
	const type = field.getFormAttributes().type ?? "text";
	const isEdit = action === "edit";

	switch (type) {
		case "select":
			const option = field.isExternal()
				? field.getOriginalTable().getOption()
				: {
						defaultValues: field.getFormValue() ?? [],
				  };
			return (
				<div className="form-group" {...props}>
					<label htmlFor={id}>{field.getFormLabel()}</label>
					<select
						defaultValue={defaultValue ?? (placeholder ? "-1" : "")}
						multiple={field.getFormAttributesMultiple()}
						name={fieldName}
						className="custom-select"
						id={id}
						{...field.getFormAttributesForAction(action)}
					>
						{!placeholder ? null : (
							<option value="-1" key="-1" disabled hidden>
								{placeholder}
							</option>
						)}
						{option.defaultValues.map((o, key) => (
							<option key={key} value={o.value}>
								{o.label}
							</option>
						))}
						{!selectOptions
							? null
							: selectOptions.map((data, key) => (
									<option
										value={
											data[
												field
													.getOriginalTable()
													?.getId()
											]
										}
										key={key}
									>
										{formatOption(option.format, data)}
									</option>
							  ))}
					</select>
				</div>
			);
		case ("checkbox", "radio"):
			return (
				<div className="form-check" {...props}>
					<input
						name={fieldName}
						type={type}
						className="form-check-input"
						id={id}
						{...field.getFormAttributesForAction(action)}
						defaultValue={
							isEdit
								? defaultValue
								: field.getFormAttributes().defaultValue
						}
					/>
					<label className="form-check-label" htmlFor={id}>
						{field.getFormLabel()}
					</label>
				</div>
			);
		case "file":
			return (
				<div className="form-group" {...props}>
					<label htmlFor={id}>{field.getFormLabel()}</label>
					<div className="input-group">
						<div className="custom-file">
							<input
								type={type}
								className="custom-file-input"
								id={id}
								name={fieldName}
								{...field.getFormAttributesForAction(action)}
								defaultValue={
									isEdit
										? defaultValue
										: field.getFormAttributes().defaultValue
								}
							/>
							<label className="custom-file-label" htmlFor={id}>
								{placeholder}
							</label>
						</div>
						<div className="input-group-append">
							<span className="input-group-text">Upload</span>
						</div>
					</div>
				</div>
			);
		case "textarea":
			return (
				<div className="form-group" {...props}>
					<label htmlFor={id}>{field.getFormLabel()}</label>
					<textarea
						name={fieldName}
						type={type}
						className="form-control"
						id={id}
						rows={4}
						placeholder={placeholder}
						{...field.getFormAttributesForAction(action)}
						defaultValue={
							isEdit
								? defaultValue
								: field.getFormAttributes().defaultValue
						}
					/>
				</div>
			);
		default:
			const p = {};
			defaultValue = isEdit
				? defaultValue
				: field.getFormAttributesDefaultValue();
			defaultValue =
				defaultValue ?? field.getFormAttributesDefaultValue();
			if (type === "number") p.step = step;
			if (type.startsWith("date"))
				defaultValue = formatDateForInput(defaultValue);
			return (
				<div className="form-group" {...props}>
					<label htmlFor={id}>{field.getFormLabel()}</label>
					<input
						name={fieldName}
						type={type}
						className="form-control"
						id={id}
						placeholder={placeholder}
						{...field.getFormAttributesForAction(action)}
						defaultValue={defaultValue}
					/>
				</div>
			);
	}
}
