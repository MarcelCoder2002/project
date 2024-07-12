import { NavLink } from "react-router-dom";

export default function Header({ title, links }) {
	return (
		<>
			{/*<!-- Content Header (Page header) -->*/}
			<div className="content-header">
				<div className="container-fluid">
					<div className="row mb-2">
						<div className="col-sm-6">
							<h1 className="m-0">{title}</h1>
						</div>
						{/*<!-- /.col -->*/}
						<div className="col-sm-6">
							<ol className="breadcrumb float-sm-right">
								{Object.keys(links).map((value) => (
									<li key={value} className="breadcrumb-item">
										<NavLink to={links[value]}>
											{value}
										</NavLink>
									</li>
								))}
								<li className="breadcrumb-item active">
									{title}
								</li>
							</ol>
						</div>
						{/*<!-- /.col -->*/}
					</div>
					{/*<!-- /.row -->*/}
				</div>
				{/*<!-- /.container-fluid -->*/}
			</div>
			{/*<!-- /.content-header -->*/}
		</>
	);
}
