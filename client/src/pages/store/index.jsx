import { Route, Outlet } from "react-router-dom";
import Home, { Router as HomeRouter, loader as homeLoader } from "./home";

export function Router() {
	return (
		<>
			<Route element={<Home />} loader={homeLoader}>
				{HomeRouter()}
			</Route>
		</>
	);
}

function Store() {
	return (
		<>
			<Outlet />
		</>
	);
}

export default Store;
