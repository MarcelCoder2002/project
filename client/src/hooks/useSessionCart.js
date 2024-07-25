import { useState } from "react";

export default function useSessionCart() {
	const sc = sessionStorage.getItem("session_cart");
	const [data, setData] = useState(JSON.parse(sc ?? "[]"));
	if (!sc) {
		sessionStorage.setItem("session_cart", JSON.stringify(data));
	}
	return [
		data,
		(data) => {
			sessionStorage.setItem("session_cart", JSON.stringify(data));
			setData(data);
		},
	];
}
