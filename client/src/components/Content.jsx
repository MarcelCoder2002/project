export default function Content({ header, main, footer }) {
	return (
		<>
			<div className="content-wrapper">
				{header}
				<section className="content">{main}</section>
				{footer ? footer : null}
			</div>
		</>
	);
}
