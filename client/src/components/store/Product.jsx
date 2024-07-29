import { useContext } from "react";
import { Card } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { RequestContext } from "../../hooks/useRequest";
import { getAsset } from "../../utils/url";

export default function Product({ data }) {
	const request = useContext(RequestContext);

	return (
		<Card className="product-card">
			{/* <Link to={`/client/produit/${product.id}`}> */}
			<div className="image-div">
				<Card.Img
					variant="top"
					src={getAsset("/img/product.png")}
					alt={data.nom}
					className="product-image"
				/>
			</div>
			{/* </Link> */}
			<Card.Body className="bg-gradient-secondary">
				<Card.Title>{data.nom}</Card.Title>
				<Card.Text>{data.description}</Card.Text>
				{!data.active && (
					<Card.Text className="prix">
						Prix: {data.prix} MAD
					</Card.Text>
				)}
				{data.active && (
					<>
						<Card.Text className="Solde">
							Promotion: {data.valeurSolde}%
						</Card.Text>
						<div>
							<Card.Text className="prixNSolde">
								{data.prixAvantSolde} MAD
							</Card.Text>
							<Card.Text className="prixSolde">
								{data.prixApresSolde} MAD
							</Card.Text>
						</div>
					</>
				)}
				{request.getUser().isAuthenticated() && (
					<NavLink
						reloadDocument
						to={`/${
							request.getUser().hasRoles("ROLE_CLIENT")
								? "profile/cart"
								: "admin/checkout"
						}?id=${data.id}`}
						className="btn btn-primary"
					>
						<i className="fas fa-plus"></i>
					</NavLink>
				)}
			</Card.Body>
		</Card>
	);
}
