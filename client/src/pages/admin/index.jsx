import { Route, Outlet } from "react-router-dom";
import Home, { Router as HomeRouter, loader as homeLoader } from "./home";
import Login, { action as loginAction } from "../../components/Login";
import useAuthenticatedUser from "../../hooks/useAuthenticatedUser";

export function Router() {
	const links = { Administration: "/admin" };
	return (
		<>
			<Route
				action={loginAction}
				path="login"
				element={
					<Login
						action="/admin/login"
						title="Connexion a l'administration"
					/>
				}
			/>
			<Route index element={<Home />} loader={homeLoader}></Route>
			{HomeRouter(links)}
		</>
	);
}

function Admin() {
	useAuthenticatedUser("ROLE_ADMIN", "/admin/login");
	return (
		<>
			<Outlet />
		</>
	);
}

export default Admin;
