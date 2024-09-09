interface BeatProps {
	type: string;
	animationSpeed: string;
}

export default function Beat({ type, animationSpeed }: BeatProps) {
	let width, margin;

	if (type === "small") {
		width = "50px";
		margin = "4px";
	} else if (type === "medium") {
		width = "75px";
		margin = "3px";
	} else if (type === "large") {
		width = "125px";
		margin = "0px";
	}

	return (
		<>
			<div className="beat" style={{ width, margin, animation: `translation ${animationSpeed} linear` }}>
				<svg version="1.0" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="150px" height="73px" viewBox="0 0 150 73" enable-background="new 0 0 150 73" xml:space="preserve">
					<polyline
						fill="none"
						stroke="#00BFFF"
						stroke-width="3"
						stroke-miterlimit="10"
						points="0,45.486 38.514,45.486 44.595,33.324 50.676,45.486 57.771,45.486 62.838,55.622 71.959,9 80.067,63.729 84.122,45.486 97.297,45.486 103.379,40.419 110.473,45.486 150,45.486"
					/>
				</svg>
			</div>
		</>
	);
}
