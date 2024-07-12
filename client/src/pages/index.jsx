import {
	RouterProvider,
	Route,
	createBrowserRouter,
	createRoutesFromElements,
} from "react-router-dom";
import Profile, { Router as ProfileRouter } from "./profile";
import Admin, { Router as AdminRouter } from "./admin";
import Store, { Router as StoreRouter } from "./store";
import Home from "./home";
import { get } from "../utils/requests";
import User from "../utils/config/User";
import Request from "../utils/config/Request";
import Domain from "../utils/config/Domain";

const loader = async () => {
	let user = null;
	try {
		const response = await get("http://localhost:8000/api/me");
		if (
			!(
				response.status < 200 ||
				response.status >= 400 ||
				response.data.status === "error"
			)
		) {
			user = response.data;
		}
	} catch (e) {}
	let path = window.location.pathname;
	if (path === "/") {
		path = "";
	} else {
		path = path.split("/")[1];
	}
	return new Request(new User(user), new Domain(path));
};

function Index() {
	return (
		<RouterProvider
			router={createBrowserRouter(
				createRoutesFromElements(
					<>
						<Route
							id="index"
							path="/"
							element={<Home />}
							loader={loader}
						>
							<Route path="store" element={<Store />}>
								{StoreRouter()}
							</Route>
							<Route path="profile" element={<Profile />}>
								{ProfileRouter()}
							</Route>
							<Route path="admin" element={<Admin />}>
								{AdminRouter()}
							</Route>
						</Route>
					</>
				)
			)}
		/>
	);
}

export default Index;
