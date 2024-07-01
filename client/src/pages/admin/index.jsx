import { Route, Outlet } from "react-router-dom";
import Home, { Router as HomeRouter, loader as homeLoader } from "./home";
import Login, { action as loginAction } from "../../components/Login";
import useAuthenticatedUser from "../../hooks/useAuthenticatedUser";
import Notification, { Router as NotificationRouter } from "./notification";

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
			<Route path="notification" element={<Notification links={links} />}>
				{NotificationRouter()}
			</Route>
		</>
	);
}

function Admin() {
	useAuthenticatedUser("ROLE_ADMIN", "/admin/login");
	return <Outlet />;
}

export default Admin;
