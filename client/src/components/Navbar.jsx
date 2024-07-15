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
							to={`/${request.getDomain().getName()}`}
							className="nav-link"
						>
							Accueil
						</NavLink>
					</li>
					{request.getDomain().getName() === "profile" &&
						request
							.getUser()
							.getRoles()
							.includes("ROLE_CLIENT") && (
							<li className="nav-item d-none d-sm-inline-block">
								<NavLink
									reloadDocument
									to="/"
									className="nav-link"
								>
									Magasin
								</NavLink>
							</li>
						)}
				</ul>

				{/* <!-- Right navbar links --> */}
				<ul className="navbar-nav ml-auto">
					{/* <!-- Navbar Search --> */}
					{!request.getUser().isAuthenticated() ? null : (
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

					<li className="nav-item">
						<a
							className="nav-link"
							data-widget="navbar-search"
							href="#"
							role="button"
						>
							<i className="fas fa-search"></i>
						</a>
						<div className="navbar-search-block">
							<form className="form-inline">
								<div className="input-group input-group-sm">
									<input
										className="form-control form-control-navbar"
										type="search"
										placeholder="Search"
										aria-label="Search"
									/>
									<div className="input-group-append">
										<button
											className="btn btn-navbar"
											type="submit"
										>
											<i className="fas fa-search"></i>
										</button>
										<button
											className="btn btn-navbar"
											type="button"
											data-widget="navbar-search"
										>
											<i className="fas fa-times"></i>
										</button>
									</div>
								</div>
							</form>
						</div>
					</li>
					<li className="nav-item">
						<a
							className="nav-link"
							data-widget="fullscreen"
							href="#"
							role="button"
						>
							<i className="fas fa-expand-arrows-alt"></i>
						</a>
					</li>
					<li className="nav-item">
						<a
							className="nav-link"
							data-widget="control-sidebar"
							data-controlsidebar-slide="true"
							href="#"
							role="button"
						>
							<i className="fas fa-th-large"></i>
						</a>
					</li>
				</ul>
			</nav>
			{/* <!-- /.navbar --> */}
		</>
	);
}
