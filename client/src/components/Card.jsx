export default function Card({
	title,
	type = "secondary",
	width = 1,
	closed = false,
	refresh = true,
	maximize = true,
	collapse = true,
	remove = false,
	...props
}) {
	return (
		<div className={`col-md-${width * 3}`}>
			<div
				className={`card card-${type}${
					closed ? " collapsed-card" : ""
				}`}
			>
				<div className="card-header">
					<h3 className="card-title">{title}</h3>
					<div className="card-tools">
						{refresh && (
							<button
								type="button"
								className="btn btn-tool"
								data-card-widget="card-refresh"
								data-source="widgets.html"
								data-source-selector="#card-refresh-content"
								data-load-on-init="false"
							>
								<i className="fas fa-sync-alt" />
							</button>
						)}
						{maximize && (
							<button
								type="button"
								className="btn btn-tool"
								data-card-widget="maximize"
							>
								<i className="fas fa-expand" />
							</button>
						)}
						{collapse && (
							<button
								type="button"
								className="btn btn-tool"
								data-card-widget="collapse"
							>
								<i
									className={`fas fa-${
										closed ? "plus" : "minus"
									}`}
								/>
							</button>
						)}
						{remove && (
							<button
								type="button"
								className="btn btn-tool"
								data-card-widget="remove"
							>
								<i className="fas fa-times" />
							</button>
						)}
					</div>
					{/* /.card-tools */}
				</div>
				{/* /.card-header */}
				<div className="card-body">{props.children}</div>
				{/* /.card-body */}
			</div>
			{/* /.card */}
		</div>
	);
}
