import { NavLink } from "react-router-dom";
import { useContext } from "react";
import { RequestContext } from "../hooks/useRequest.js";

export default function Navbar() {
	const request = useContext(RequestContext);
	const handleClick = (event) => {
		event.preventDefault();
		sessionStorage.removeItem("accessToken");
		window.location = "/";
	};

	const notifications = request
		.getUser()
		.getIncludesData("notification")
		.filter((notification) => notification.vue === false).length;

	return (
		<>
			{/* <!-- Navbar --> */}
			<nav className="main-header navbar navbar-expand navbar-white navbar-light">
				{/* <!-- Left navbar links --> */}
				<ul className="navbar-nav">
					<li className="nav-item">
						<a
							className="nav-link"
							data-widget="pushmenu"
							href="#"
							role="button"
						>
							<i className="fas fa-bars"></i>
						</a>
					</li>
					<li className="nav-item d-none d-sm-inline-block">
						<NavLink
							to={`/${
								request.getUser().isAuthenticated()
									? request.getUser().hasRoles("ROLE_CLIENT")
										? "profile"
										: "admin"
									: ""
							}`}
							reloadDocument
							className="nav-link"
						>
							Accueil
						</NavLink>
					</li>
					{request.getDomain().getName() !== "" && (
						<li className="nav-item d-none d-sm-inline-block">
							<NavLink reloadDocument to="/" className="nav-link">
								Magasin
							</NavLink>
						</li>
					)}
				</ul>

				{/* <!-- Right navbar links --> */}
				<ul className="navbar-nav ml-auto">
					{/* <!-- Navbar Search --> */}
					{request.getUser().isAuthenticated() && (
						<li className="nav-item">
							<a
								className="nav-link"
								href="#"
								role="button"
								onClick={handleClick}
							>
								Se déconnecter
							</a>
						</li>
					)}
					{request.getUser().isAuthenticated() && (
						<li className="nav-item">
							<NavLink
								to={`/${request
									.getDomain()
									.getName()}/notification`}
								className="nav-link"
								reloadDocument
							>
								<i className="far fa-bell" />
								{notifications > 0 && (
									<span
										id="notifications-number"
										className="badge badge-warning navbar-badge"
									>
										{notifications}
									</span>
								)}
							</NavLink>
						</li>
					)}
				</ul>
			</nav>
			{/* <!-- /.navbar --> */}
		</>
	);
}
