import { useEffect, useState } from "react";
import { delete_, get, post, put } from "../utils/requests";

export default function useFetch(url, data = {}, method = "get", options = {}) {
	const [loading, setLoading] = useState(true);
	const [data_, setData] = useState(null);
	const [errors, setErrors] = useState(null);

	let m;

	switch (method.toLowerCase().trim()) {
		case "post":
			m = post;
			break;
		case "put":
			m = put;
			break;
		case "delete":
			m = delete_;
			break;
		default:
			m = get;
	}

	useEffect(() => {
		m(url, data, {
			...options,
			headers: {
				Accept: "application/json; charset=UTF-8",
				...options.headers,
			},
		})
			.then((response) => {
				setData(response.data);
			})
			.catch((e) => {
				setErrors(e);
			})
			.finally(() => {
				setLoading(false);
			});
	}, [url]);

	return {
		loading,
		data: data_,
		errors,
	};
}
