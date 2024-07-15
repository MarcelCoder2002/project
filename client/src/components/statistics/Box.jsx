import { NavLink } from "react-router-dom";

export default function Box({
	value,
	title,
	icon,
	type = "secondary",
	to,
	format = "text",
}) {
	let temp = null;

	switch (format) {
		case "price":
			temp = (
				<h3>
					{value}
					<sup style="font-size: 20px">MAD</sup>
				</h3>
			);
			break;
		case "percentage":
			temp = (
				<h3>
					{value}
					<sup style="font-size: 20px">%</sup>
				</h3>
			);
			break;
		default:
			temp = <h3>{value}</h3>;
			break;
	}

	return (
		<div className="col-lg-3 col-6">
			<div className={`small-box bg-${type}`}>
				<div className="inner">
					{temp}
					<p>{title}</p>
				</div>
				<div className="icon">
					<i className={icon} />
				</div>

				{to === null || to === undefined ? null : (
					<NavLink to={to} className="small-box-footer">
						Voir plus <i className="fas fa-arrow-circle-right" />
					</NavLink>
				)}
			</div>
		</div>
	);
}
