import { Route, Outlet } from "react-router-dom";
import Home from "./home";
import Login, {action as loginAction} from "../../components/Login";
import Cart from "./cart.jsx";
import React from "react";
import FidelityCard from "./fidelity_card.jsx";
import Gifts, {loader as giftsLoader} from "./gifts.jsx";
import Complaint, {Router as ComplaintRouter} from "./complaint";

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
			<Route index element={<Home />}></Route>
			<Route path="cart" element={<Cart />}></Route>
			<Route path="fidelity_card" element={<FidelityCard />}></Route>
			<Route path="gifts" element={<Gifts />} loader={giftsLoader}></Route>
			<Route path="complaint" element={<Complaint />}>
				{ComplaintRouter()}
			</Route>
		</>
	);
}

function Profile() {
	return (
		<>
			<Outlet />
		</>
	);
}

export default Profile;
