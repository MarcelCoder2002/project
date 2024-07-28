import { redirect } from "react-router-dom";
import { delete_ } from "../../../../utils/requests";
import { getBackendURL } from "../../../../utils/url";

export const action = async ({ params }) => {
	if (confirm("Êtes-vous sûr ?")) {
		delete_(
			getBackendURL(`/api/table/${params.name}/delete/${params.id}`)
		).then((response) => {
			if (response.status !== 200) {
				alert(response.data.message);
			} else {
				alert(response.data.message);
				window.location = window.location;
			}
		});
		return redirect("../");
	}
	return null;
};
