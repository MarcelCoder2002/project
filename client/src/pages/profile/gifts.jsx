import Content from "../../components/Content";
import Header from "../../components/Header";
import DataTable from "../../components/DataTable.jsx";
import {NavLink, useLoaderData} from "react-router-dom";
import {useContext} from "react";
import {RequestContext} from "../../hooks/useRequest.js";
import qs from "qs";
import {get} from "../../utils/requests.js";

export const loader = async ({params}) => {
    const query = qs.stringify({
        include: [
            'cheque_cadeau'
        ]
    })
    return (await get(`http://localhost:8000/api/me?${query}`)).data;
};

function Gifts() {
    const request = useContext(RequestContext);
    const data = useLoaderData()
    const actions = request.getUser().getTableActions('cheque_cadeau');
    const links = {
        Profile: "/profile"
    }
    return (
        <>
            <Content header={<Header title="Chèques cadeau" links={links}/>} main={
                <>
                    {!actions.includes("new") ? null : (
                        <NavLink
                            to="new"
                            className="btn btn-primary"
                            style={{marginBottom: 20}}
                        >
                            Ajouter
                        </NavLink>
                    )}
                    <DataTable
                        tableName="cheque_cadeau"
                        actions={actions}
                        rows={data.includes.cheque_cadeau}/>
                </>
            }/>
        </>
    );
}

export default Gifts;
