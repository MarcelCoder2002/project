import { getAsset } from "../utils/url";

export default function Loading() {
	return (
		<>
			{/* <!-- Preloader --> */}
			<div className="preloader flex-column justify-content-center align-items-center">
				<img
					className="animation__shake"
					src={getAsset("/img/logo.png")}
					alt="logo"
					height="60"
					width="60"
				/>
			</div>
		</>
	);
}
