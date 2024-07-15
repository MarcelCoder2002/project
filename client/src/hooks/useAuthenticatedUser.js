import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { RequestContext } from "./useRequest";
import { containsAll } from "../utils/array";

export default function useAuthenticatedUser(roles, to = "/") {
	const navigate = useNavigate();
	const request = useContext(RequestContext);

	useEffect(() => {
		if (
			!request.getUser().isAuthenticated() ||
			!containsAll(
				Array.isArray(roles) ? roles : [roles],
				request.getUser().getRoles()
			)
		) {
			navigate(to);
		}
	}, [navigate]);

	return request;
}
