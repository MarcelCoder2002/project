import {
	RouterProvider,
	Route,
	createBrowserRouter,
	createRoutesFromElements,
} from "react-router-dom";
import Profile, { Router as ProfileRouter } from "./profile";
import Admin, { Router as AdminRouter } from "./admin";
import Store, { Router as StoreRouter } from "./store";
import Home, { loader as homeLoader } from "./home";
import config from "../config/config.json";

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
							loader={homeLoader}
						>
							<Route path="" element={<Store />}>
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
				),
				{ basename: config?.server?.base }
			)}
		/>
	);
}

export default Index;
