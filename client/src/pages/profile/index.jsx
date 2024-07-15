import { Route, Outlet } from "react-router-dom";
import Home, { loader as homeLoader } from "./home";
import Login, { action as loginAction } from "../../components/Login";
import Cart, { loader as cartLoader } from "./cart.jsx";
import React from "react";
import Complaint, { Router as ComplaintRouter } from "./complaint";
import useAuthenticatedUser from "../../hooks/useAuthenticatedUser.js";
import Purchases, { loader as purchasesLoader } from "./purchases.jsx";

export function Router() {
	return (
		<>
			<Route
				action={loginAction}
				path="login"
				element={
					<Login
						action="/profile/login"
						title="Connexion au profile"
					/>
				}
			/>
			<Route index element={<Home />} loader={homeLoader}></Route>
			<Route
				path="purchases"
				element={<Purchases />}
				loader={purchasesLoader}
			></Route>
			<Route path="cart" element={<Cart />} loader={cartLoader}></Route>
			<Route path="complaint" element={<Complaint />}>
				{ComplaintRouter()}
			</Route>
		</>
	);
}

function Profile() {
	useAuthenticatedUser("ROLE_CLIENT", "/profile/login");
	return <Outlet />;
}

export default Profile;
