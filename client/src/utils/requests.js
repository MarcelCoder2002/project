import axios from "axios";

class Resquest {}

function getConfig() {
	return {
		headers: {
			accessToken: sessionStorage.getItem("accessToken"),
		},
	};
}

export function get(url, data = {}, config = {}) {
	const finalConfig = { ...getConfig(), ...config };
	finalConfig.headers.accessToken = sessionStorage.getItem("accessToken");
	return axios.get(url, finalConfig);
}

export function post(url, data = {}, config = {}) {
	const finalConfig = { ...getConfig(), ...config };
	return axios.post(url, data, finalConfig);
}

export function put(url, data = {}, config = {}) {
	const finalConfig = { ...getConfig(), ...config };
	return axios.put(url, data, finalConfig);
}

export function delete_(url, data = {}, config = {}) {
	const finalConfig = { ...getConfig(), ...config };
	return axios.delete(url, finalConfig);
}

export function postForm(url, data = {}, config = {}) {
	const finalConfig = { ...getConfig(), ...config };
	return axios.postForm(url, data, finalConfig);
}

export function putForm(url, data = {}, config = {}) {
	const finalConfig = { ...getConfig(), ...config };
	return axios.putForm(url, data, finalConfig);
}

const request = new Resquest();
export default request;
