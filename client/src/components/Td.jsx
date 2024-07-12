import React from "react";
import { useNavigate } from "react-router-dom";

function Td({ to, children, ...props }) {
	const navigate = useNavigate();

	const handleClick = () => {
		navigate(to);
	};

	return (
		<td onClick={handleClick} {...props} style={{ cursor: "pointer" }}>
			{children}
		</td>
	);
}

export default Td;
