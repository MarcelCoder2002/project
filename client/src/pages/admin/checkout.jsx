import Content from "../../components/Content";
import Header from "../../components/Header";

export default function Checkout({ links }) {
	return <Content header={<Header title="Caisse" links={links} />}></Content>;
}
