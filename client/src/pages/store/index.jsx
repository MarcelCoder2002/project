import { Route, Outlet } from "react-router-dom";
import Home, { loader as homeLoader } from "./home";

export function Router() {
	return (
		<>
			<Route index element={<Home />} loader={homeLoader}></Route>
		</>
	);
}

function Store() {
	return <Outlet />;
}

export default Store;
