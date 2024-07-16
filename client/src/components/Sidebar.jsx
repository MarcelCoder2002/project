import React, { useContext } from "react";
import { Link, NavLink } from "react-router-dom";
import { RequestContext } from "../hooks/useRequest.js";
import Table from "../utils/config/Table.js";

export default function Sidebar() {
	const request = useContext(RequestContext);
	const basename = request.getDomain().getName()
		? "/" + request.getDomain().getName()
		: "";
	return (
		<>
			{/*<!-- Main Sidebar Container -->*/}
			<aside className="main-sidebar sidebar-dark-primary elevation-4">
				{/*<!-- Brand Logo -->*/}
				<a
					href={`/${request.getDomain().getName()}`}
					className="brand-link"
				>
					<img
						src="/dist/img/logo.png"
						alt="logo"
						className="brand-image img-circle elevation-3"
						style={{ opacity: 0.8 }}
					/>
					<span className="brand-text font-weight-light">
						{request.getDomain().getTitle()}
					</span>
				</a>

				{/*<!-- Sidebar -->*/}
				<div className="sidebar">
					{/*<!-- Sidebar user panel (optional) -->*/}
					<div className="user-panel mt-3 pb-3 mb-3 d-flex">
						<div className="image">
							<img
								src={request.getUser().getImage()}
								className="img-circle elevation-2"
								alt="User Image"
							/>
						</div>
						<div className="info">
							<Link
								reloadDocument
								to={
									request.getUser().isAuthenticated()
										? `/${request.getDomain().getName()}`
										: "/profile/login"
								}
								className="d-block"
							>
								{request.getUser().isAuthenticated()
									? request.getUser().getFullName()
									: "Se connecter"}
							</Link>
						</div>
					</div>

					{/*<!-- SidebarSearch Form -->*/}
					<div className="form-inline">
						<div
							className="input-group"
							data-widget="sidebar-search"
						>
							<input
								className="form-control form-control-sidebar"
								type="search"
								placeholder="Search"
								aria-label="Search"
							/>
							<div className="input-group-append">
								<button className="btn btn-sidebar">
									<i className="fas fa-search fa-fw"></i>
								</button>
							</div>
						</div>
					</div>

					{/*<!-- Sidebar Menu -->*/}
					<nav className="mt-2">
						{!request
							.getUser()
							.hasMenuForDomain(request.getDomain()) ? null : (
							<ul
								className="nav nav-pills nav-sidebar flex-column"
								data-widget="treeview"
								role="menu"
								data-accordion="false"
							>
								{/* <!-- Add icons to the links using the .nav-icon class
               with font-awesome or any other icon font library --> */}
								{request
									.getUser()
									.getMenuForDomain(request.getDomain())
									.map((menu, key) => (
										<li
											key={key}
											className="nav-item menu-open"
										>
											<NavLink
												reloadDocument={false}
												to={`${basename}/${menu.menu.getName()}`}
												className="nav-link"
											>
												<i
													className={menu.menu.getIcon()}
												></i>
												<p>
													{menu.menu.getTitle()}
													{!menu.menu.hasSubMenu() ? null : (
														<i className="fas fa-angle-left right"></i>
													)}
												</p>
											</NavLink>
											{!menu.menu.hasSubMenu() ? null : (
												<ul className="nav nav-treeview">
													{menu.subMenus.map(
														(subMenu, key) => (
															<li
																key={key}
																className="nav-item"
															>
																<NavLink
																	reloadDocument={Table.isTable(
																		subMenu.getName()
																	)}
																	to={`${basename}/${menu.menu.getName()}/${subMenu.getName()}`}
																	className="nav-link"
																>
																	<i
																		className={subMenu.getIcon()}
																	></i>
																	<p>
																		{subMenu.getTitle()}
																	</p>
																</NavLink>
															</li>
														)
													)}
												</ul>
											)}
										</li>
									))}
							</ul>
						)}
					</nav>
					{/*<!-- /.sidebar-menu -->*/}
				</div>
				{/*<!-- /.sidebar -->*/}
			</aside>
		</>
	);
}
