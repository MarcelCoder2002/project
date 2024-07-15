import { Card } from "react-bootstrap";
import { NavLink } from "react-router-dom";

export default function Product({ data }) {
	return (
		<Card className="product-card">
			{/* <Link to={`/client/produit/${product.id}`}> */}
			<div className="image-div">
				<Card.Img
					variant="top"
					src="/dist/img/product.png"
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
				<NavLink
					reloadDocument
					to={`/profile/cart?id=${data.id}`}
					className="btn btn-primary"
				>
					<i className="fas fa-plus"></i>
				</NavLink>
			</Card.Body>
		</Card>
	);
}
