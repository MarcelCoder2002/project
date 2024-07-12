import { createElement, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useUser from "./useUser";

export default function useAuthenticatedUser(
	userExtraParams = "",
	loadingPage = null
) {
	const navigate = useNavigate();
	const { user, loading, error } = useUser(userExtraParams);

	useEffect(() => {
		if ((!loading && !user) || error) {
			navigate("/admin/login");
		}
	}, [loading, user, navigate]);

	if (loading) {
		return {
			loadingPage: loadingPage
				? loadingPage()
				: createElement("p", {
						children: "Loading...",
				  }),
			user: user,
		};
	}
	return {
		loadingPage: null,
		user: user,
	};
}
