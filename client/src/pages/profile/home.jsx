import React, {useContext, useEffect} from "react";
import "../../../plugins/jquery/jquery.min.js";
import "../../../plugins/bootstrap/js/bootstrap.bundle.min.js";
import "../../../plugins/chart.js/Chart.min.js";
import "../../../dist/js/adminlte.min.js";
import {
	Outlet,
	Route,
	useNavigate,
} from "react-router-dom";
import {RequestContext} from "../../hooks/useRequest.js";
import Header from "../../components/Header.jsx";
import Content from "../../components/Content.jsx";

function Home() {
	const request = useContext(RequestContext);
	const navigate = useNavigate();

	useEffect(() => {
		if (
			!request.getUser().isAuthenticated() ||
			!request.getUser().getRoles().includes("ROLE_CLIENT")
		) {
			navigate("/profile/login");
		}
	}, []);

	return <Content header={<Header title="Profile" links={{}} />} main={<></>} />
}

export default Home;
