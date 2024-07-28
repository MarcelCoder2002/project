import React from "react";
import Links from "../../components/Links.jsx";
import Navbar from "../../components/Navbar.jsx";
import Sidebar from "../../components/Sidebar.jsx";

import "../../../plugins/jquery/jquery.min.js";
import "../../../plugins/bootstrap/js/bootstrap.bundle.min.js";
import "../../../plugins/chart.js/Chart.min.js";
import "../../../assets/js/adminlte.min.js";
import { useLoaderData } from "react-router-dom";
import Content from "../../components/Content.jsx";
import Header from "../../components/Header.jsx";
import { get } from "../../utils/requests.js";
import { getBackendURL } from "../../utils/url.js";
import Products from "../../components/store/Products.jsx";

export const loader = async ({}) => {
	return (await get(getBackendURL(`/api/table/produit`))).data;
};

function Home() {
	const products = useLoaderData();
	return (
		<Content
			header={<Header title={"Magasin"} links={{}} />}
			main={<Products data={products} />}
		/>
	);
}

export default Home;
