import { Route, Outlet } from "react-router-dom";
import Home, { Router as HomeRouter, loader as homeLoader } from "./home";
import Login, {action as loginAction} from "../../components/Login";

export function Router() {
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
			{HomeRouter()}
		</>
	);
}

function Admin() {
	return (
		<>
			<Outlet />
		</>
	);
}

export default Admin;
