import React from "react";
import { useNavigate } from "react-router-dom";

function Tr({ to, children, ...props }) {
	const navigate = useNavigate();

	const handleClick = () => {
		navigate(to);
	};

	return (
		<tr onClick={handleClick} {...props} style={{ cursor: "pointer" }}>
			{children}
		</tr>
	);
}

export default Tr;
