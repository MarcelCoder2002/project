import Product from "./Product";
import { Container, Row, Col, Card, Button } from "react-bootstrap";

export default function Products({ data }) {
	return (
		<Container className="mt-5">
			<div className="product-section">
				<h2 className="section-title">Liste des Produits</h2>
				<Row xs={1} md={2} lg={3} className="g-4">
					{data.map((product, key) => (
						<Col key={key}>
							<Product data={product} />
						</Col>
					))}
				</Row>
			</div>
		</Container>
	);
}
