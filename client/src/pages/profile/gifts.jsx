import Content from "../../components/Content";
import Header from "../../components/Header";

function Gifts() {
    const links = {
        Profile: "/profile"
    }
    return (
        <>
            <Content header={<Header title="Chèques cadeau" links={links}/>}/>
        </>
    );
}

export default Gifts;
