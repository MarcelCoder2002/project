import Content from "../../components/Content";
import Header from "../../components/Header";

function Cart() {
	const links = {
		Profile: "/profile"
	}
	return (
		<>
			<Content header={<Header title="Panier" links={links}/>} />
		</>
	);
}

export default Cart;
