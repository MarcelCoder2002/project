import config from "../config/config.json";

export function getBackendURL(path) {
	const server = config.backendServer;
	return `http${server.https ? "s" : ""}://${
		server.host ? server.host : "localhost"
	}${server.port ? ":" + server.port : ""}${
		server.root ? "/" + server.root : ""
	}${path ? (path.startsWith("/") ? path : "/" + path) : "/"}`;
}

export function getPathname(url) {
	try {
		const parsedUrl = new URL(url);
		return parsedUrl.pathname;
	} catch (error) {
		console.error("Invalid URL:", error);
		return null;
	}
}
