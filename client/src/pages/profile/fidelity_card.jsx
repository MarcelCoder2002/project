import Content from "../../components/Content";
import Header from "../../components/Header";

function FidelityCard() {
    const links = {
        Profile: "/profile"
    }
    return (
        <>
            <Content header={<Header title="Carte fidélité" links={links}/>}/>
        </>
    );
}

export default FidelityCard;
