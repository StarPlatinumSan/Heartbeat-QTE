import { useEffect, useState, useRef } from "react";
import Beat from "./Beat";

function App() {
	const [beats, setBeats] = useState<JSX.Element[]>([]);
	const [isActive, setIsActive] = useState<boolean>(false);
	const [isDifficultyButtonDisabled, setIsDifficultyButtonDisabled] = useState<boolean>(false);

	const [animSpeed, setAnimSpeed] = useState<string>("6s");
	const [typeBeat, setTypeBeat] = useState<string>("medium");
	const [pairBeatGap, setPairBeatGap] = useState<number>(250);
	const [beatGap, setBeatGap] = useState<number>(1000);
	const [repetition, setRepetition] = useState<number>(16);

	const lvlRef = useRef<HTMLDivElement>(null);

	const handleClick = () => {
		clearBeats();
		setIsActive(!isActive);
	};

	const handleDifficulty = () => {
		const diff = document.getElementById("lvl");
		if (diff) {
			diff.style.transform = "translate(0, -50%)";
		}
	};

	const closeDiff = () => {
		const diff = document.getElementById("lvl");
		if (diff) {
			diff.style.transform = "translate(100%, -50%)";
		}
	};

	const changeDifficulty = (event: React.MouseEvent<HTMLButtonElement>) => {
		const clickedButton = event.currentTarget;
		const allButtons = document.querySelectorAll(".btnDiff");

		clickedButton.style.backgroundColor = "orange";

		allButtons.forEach((button) => {
			if (button !== clickedButton) {
				(button as HTMLElement).style.backgroundColor = "white";
			}
		});

		if (clickedButton.id === "easy") {
			setAnimSpeed("10s");
			setTypeBeat("large");
			setPairBeatGap(800);
			setBeatGap(2000);
			setRepetition(16);
		} else if (clickedButton.id === "medium") {
			setAnimSpeed("6s");
			setTypeBeat("medium");
			setPairBeatGap(250);
			setBeatGap(1000);
			setRepetition(16);
		} else if (clickedButton.id === "hard") {
			setAnimSpeed("4s");
			setTypeBeat("medium");
			setPairBeatGap(250);
			setBeatGap(500);
			setRepetition(24);
		} else if (clickedButton.id === "extreme") {
			setAnimSpeed("2.5s");
			setTypeBeat("medium");
			setPairBeatGap(150);
			setBeatGap(500);
			setRepetition(32);
		} else if (clickedButton.id === "agony") {
			setAnimSpeed("1s");
			setTypeBeat("small");
			setPairBeatGap(150);
			setBeatGap(500);
			setRepetition(32);
		}
	};

	useEffect(() => {
		if (isActive) {
			setIsDifficultyButtonDisabled(true);

			let beatIndex = 0;

			const addBeatPair = () => {
				setBeats((prevBeats) => [...prevBeats, <Beat key={Date.now()} type={typeBeat} animationSpeed={animSpeed} />]);

				setTimeout(() => {
					setBeats((prevBeats) => [...prevBeats, <Beat key={Date.now()} type={typeBeat} animationSpeed={animSpeed} />]);

					beatIndex += 2;
					if (beatIndex < repetition) {
						setTimeout(addBeatPair, pairBeatGap);
					} else {
						setIsActive(false);
						setIsDifficultyButtonDisabled(false);
					}
				}, beatGap);
			};

			addBeatPair();
		}
	}, [isActive]);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (lvlRef.current && !lvlRef.current.contains(event.target as Node)) {
				lvlRef.current.style.transform = "translate(100%, -50%)";
			}
		};

		document.addEventListener("mousedown", handleClickOutside);

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.code === "Space") {
				event.preventDefault();
			}
		};

		document.addEventListener("keydown", handleKeyDown);

		return () => {
			document.removeEventListener("keydown", handleKeyDown);
		};
	}, []);

	const clearBeats = () => {
		setBeats([]);
	};

	return (
		<>
			<main className="container">
				<div className="diff" id="lvl" ref={lvlRef}>
					<button className="closeDiff xButton" onClick={closeDiff}>
						X
					</button>
					<div className="quick">
						<h2>Quick Difficulty</h2>
						<p>Select from a fixed ranged of levels of difficulty.</p>
						<div className="allButtons">
							<button className="btnDiff" onClick={changeDifficulty} id="easy">
								Easy
							</button>
							<button className="btnDiff" onClick={changeDifficulty} id="medium">
								Normal
							</button>
							<button className="btnDiff" onClick={changeDifficulty} id="hard">
								Hard
							</button>
							<button className="btnDiff" onClick={changeDifficulty} id="extreme">
								Extreme
							</button>
							<button className="btnDiff" onClick={changeDifficulty} id="agony">
								Agony
							</button>
						</div>
					</div>
					<div className="complex">
						<h2>Custom Difficulty</h2>
						<p>Work in progress...</p>
					</div>
				</div>
				<header className="header">
					<h1>Heartbeat QTE - Keep Calm</h1>
					<button className="buttonDifficulty" onClick={handleDifficulty} disabled={isDifficultyButtonDisabled}>
						Difficulty
					</button>
				</header>
				<div className="center">
					<div className="reflexe"></div>
					<div className="line">{beats}</div>
				</div>

				<div className="manageButtons">
					<button onClick={handleClick} className="buttonStart">
						Start Beats
					</button>
					<button className="buttonStart">Reset</button>
				</div>
			</main>
		</>
	);
}

export default App;
