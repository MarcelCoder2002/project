import Content from "../../components/Content";
import Header from "../../components/Header";
import { post } from "../../utils/requests";
import Cart from "../../components/Cart";
import { formDataToJson } from "../../utils/format";

const submit = async ({ request, toast }) => {
	if (confirm("Êtes-vous sûr ?")) {
		try {
			const response = await post(
				`http://localhost:8000/api/table/checkout`,
				formDataToJson(await request.formData())
			);
			if (response.data.status === "error") {
				toast.show({
					severity: "error",
					summary: "Echec de validation",
					detail: response.data.message,
					life: 5000,
				});
				return false;
			} else {
				toast.show({
					severity: "success",
					summary: "Succes de la validation",
					life: 5000,
				});
				return true;
			}
		} catch (error) {
			toast.show({
				severity: "error",
				summary: "Echec de validation",
				detail: error.message,
				life: 5000,
			});
			return false;
		}
	}
	return false;
};

function Checkout({ links }) {
	return (
		<Content
			header={<Header title="Caisse" links={links} />}
			main={<Cart action="/admin/checkout" submit={submit} />}
		/>
	);
}

export default Checkout;
