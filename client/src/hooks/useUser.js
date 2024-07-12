import { useNavigate } from "react-router-dom";
import { get } from "../utils/requests";
import { useEffect, useState } from "react";

export default function useUser(userExtraParams = "") {
	const navigate = useNavigate();
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const accessToken = sessionStorage.getItem("accessToken");
		if (accessToken) {
			get("http://localhost:8000/api/me")
				.then((response) => {
					setUser(response.data);
					setLoading(false);
				})
				.catch((error) => {
					setError(error);
					navigate("/admin/login");
				});
		} else {
			navigate("/admin/login");
		}
	}, [navigate]);

	return { user, loading, error };
}
