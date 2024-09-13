import { useEffect, useState, useRef } from "react";
import Beat from "./Beat";
import React from "react";

function App() {
	const [beats, setBeats] = useState<JSX.Element[]>([]);
	const [isActive, setIsActive] = useState<boolean>(false);
	const [isDifficultyButtonDisabled, setIsDifficultyButtonDisabled] = useState<boolean>(false);
	const [spaceBarAllowed, setSpaceBarAllowed] = useState<boolean>(false);

	const [animSpeed, setAnimSpeed] = useState<string>("6s");
	const [typeBeat, setTypeBeat] = useState<string>("medium");
	const [pairBeatGap, setPairBeatGap] = useState<number>(250);
	const [beatGap, setBeatGap] = useState<number>(1000);
	const [repetition, setRepetition] = useState<number>(16);
	const lvlRef = useRef<HTMLDivElement>(null);
	const timeoutsRef = useRef<NodeJS.Timeout[]>([]);

	const centerDivRef = useRef<HTMLDivElement>(null);
	const [isOverlapping, setIsOverlapping] = useState(false);
	const [currentBeatIndex, setCurrentBeatIndex] = useState<number>(0);

	const ref = useRef<(HTMLDivElement | null)[]>([]);

	const beatRefs = useRef<(HTMLDivElement | null)[]>([]);

	/* const checkOverlap = (beatRef: React.RefObject<HTMLDivElement>) => {
		const centerDiv = centerDivRef.current;
		const centerDivRect = centerDiv?.getBoundingClientRect();
		const beatRect = beatRef.current?.getBoundingClientRect();

		if (centerDivRect && beatRect) {
			if (beatRect.left < centerDivRect.right && beatRect.right > centerDivRect.left) {
				setIsOverlapping(true);
			} else {
				setIsOverlapping(false);
			}
		}
	}; */

	const handleSpacebarPress = (event: KeyboardEvent) => {
		if (event.key === " " && spaceBarAllowed) {
			checkBeatPosition();
		}
	};

	useEffect(() => {
		window.addEventListener("keydown", handleSpacebarPress);

		return () => {
			window.removeEventListener("keydown", handleSpacebarPress);
		};
	}, [isOverlapping, spaceBarAllowed]);

	const handleClick = () => {
		timeoutsRef.current.forEach((timeoutId) => clearTimeout(timeoutId));
		timeoutsRef.current = [];
		clearBeats();
		setCurrentBeatIndex(0);
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

	const stopGame = () => {
		timeoutsRef.current.forEach((timeoutId) => clearTimeout(timeoutId));
		timeoutsRef.current = [];

		clearBeats();
		setIsActive(false);
		setIsDifficultyButtonDisabled(false);
		setSpaceBarAllowed(false);
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

		if (clickedButton.id !== "custom") {
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
			} else {
				setAnimSpeed("15s");
				setTypeBeat("small");
				setPairBeatGap(150);
				setBeatGap(500);
				setRepetition(32);
			}
		}
	};

	const handleCustomSpeed = (event: React.ChangeEvent<HTMLInputElement>) => {
		handleOrangeButton();
		setAnimSpeed(event.target.value + "s");
	};

	const handleCustomSize = (val: string) => {
		handleOrangeButton();
		setTypeBeat(val);
	};

	const handleCustomRepetition = (event: React.ChangeEvent<HTMLInputElement>) => {
		handleOrangeButton();

		if (event.target.value === "") {
			setRepetition(16);
		} else {
			setRepetition(Number(event.target.value));
		}
	};

	const handleOrangeButton = () => {
		const clickedButton = document.getElementById("custom");
		if (clickedButton) {
			clickedButton.style.backgroundColor = "orange";
		}

		const allButtons = document.querySelectorAll(".btnDiff");

		allButtons.forEach((button) => {
			if (button !== clickedButton) {
				(button as HTMLElement).style.backgroundColor = "white";
			}
		});
	};

	useEffect(() => {
		if (isActive) {
			setIsDifficultyButtonDisabled(true);
			setSpaceBarAllowed(true);

			let beatIndex = 0;
			let index = 0;
			const animationDuration = parseFloat(animSpeed) * 1000;

			const addBeatPair = () => {
				setBeats((prevBeats) => [...prevBeats, <Beat key={beatIndex} ref={(el) => (beatRefs.current[index] = el)} type={typeBeat} animationSpeed={animSpeed} />]);
				index++;

				const secondBeatTimeout = setTimeout(() => {
					setBeats((prevBeats) => [...prevBeats, <Beat key={beatIndex + 1} ref={(el) => (beatRefs.current[index] = el)} type={typeBeat} animationSpeed={animSpeed} />]);

					beatIndex += 2;
					index++;
					if (beatIndex < repetition) {
						const nextBeatTimeout = setTimeout(addBeatPair, pairBeatGap);
						timeoutsRef.current.push(nextBeatTimeout);
					} else {
						setIsActive(false);

						const totalAnimationTime = animationDuration;

						const enableDifficultyTimeout = setTimeout(() => {
							setIsDifficultyButtonDisabled(false);
							setSpaceBarAllowed(false);
						}, totalAnimationTime);

						timeoutsRef.current.push(enableDifficultyTimeout);
					}
				}, beatGap);
				timeoutsRef.current.push(secondBeatTimeout);
			};

			addBeatPair();
		}
	}, [isActive, animSpeed, typeBeat, pairBeatGap, beatGap, repetition]);

	/* useEffect qui vérifie que chaque beat a un ref */
	/* useEffect(() => {
		if (beats.length > 0) {
			const lastIndex = beats.length - 1;
			const lastRef = ref.current[lastIndex];
			console.log(`Ref for the latest Beat (Beat ${lastIndex + 1}):`, lastRef);
		}
	}, [beats]); */

	/* BUG */

	const checkBeatPosition = () => {
		if (spaceBarAllowed) {
			const centerDiv = centerDivRef.current?.getBoundingClientRect();
			const beatRefCurrent = beatRefs.current[currentBeatIndex];

			if (beatRefCurrent) {
				const beatRect = beatRefCurrent.getBoundingClientRect();

				if (centerDiv && beatRect.left < centerDiv.right && beatRect.right > centerDiv.left) {
					console.log("Beat", currentBeatIndex, "is overlapping!");
				} else {
					console.log("Beat", currentBeatIndex, "is not overlapping");
				}

				setCurrentBeatIndex((prevIndex) => (prevIndex + 1) % beats.length);
			} else {
				console.log("Beat reference not found");
			}
		}
	};

	useEffect(() => {
		window.addEventListener("click", checkBeatPosition);

		return () => {
			window.removeEventListener("click", checkBeatPosition);
		};
	}, [beats, spaceBarAllowed]);

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

	const clearBeats = () => {
		setBeats([]);
		setCurrentBeatIndex(0);
	};

	const handleGame = (event: KeyboardEvent | MouseEvent) => {
		if (((event.type === "keydown" && event.code === "Space") || (event.type === "mousedown" && event.button === 0)) && spaceBarAllowed && isActive) {
			event.preventDefault();
		}
	};

	useEffect(() => {
		window.addEventListener("keydown", handleGame);
		window.addEventListener("mousedown", handleGame);

		return () => {
			window.removeEventListener("keydown", handleGame);
			window.removeEventListener("mousedown", handleGame);
		};
	}, [spaceBarAllowed]);

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
						<p>Customize your own difficulty.</p>
						<button className="btnDiff" id="custom" onClick={changeDifficulty}>
							Custom
						</button>
						<div className="speedDiv">
							<h3>Beats speed:</h3>
							<input type="range" id="speedRange" className="rangeInput" min={1} max={12} step={0.5} value={parseFloat(animSpeed)} onChange={handleCustomSpeed} />
						</div>

						<div className="sizeDiv">
							<h3>Beat size:</h3>
							<div className="radioLabel">
								<input type="radio" className="size" id="smallRadio" name="radioSize" value={typeBeat} checked={typeBeat === "small"} onChange={() => handleCustomSize("small")} />
								<label htmlFor="radioSize">Small</label>
							</div>

							<div className="radioLabel">
								<input type="radio" className="size" id="mediumRadio" name="radioSize" value={typeBeat} checked={typeBeat === "medium"} onChange={() => handleCustomSize("medium")} />
								<label htmlFor="radioSize">Medium</label>
							</div>

							<div className="radioLabel">
								<input type="radio" className="size" id="largeRadio" name="radioSize" value={typeBeat} checked={typeBeat === "large"} onChange={() => handleCustomSize("large")} />
								<label htmlFor="radioSize">Large</label>
							</div>
						</div>

						<div className="repetitionDiv">
							<h3>Number of beats:</h3>
							<input type="number" id="repetitionInput" className="repetition" min={3} max={60} step={1} value={repetition} onChange={handleCustomRepetition} />
						</div>
					</div>
				</div>
				<header className="header">
					<h1>Heartbeat QTE - Keep Calm</h1>
					<button className="buttonDifficulty" onClick={handleDifficulty} disabled={isDifficultyButtonDisabled}>
						Difficulty
					</button>
				</header>
				<div className="center">
					<div className="reflexe" id="centerReflexe" ref={centerDivRef}></div>
					<div className="line">{beats}</div>
				</div>

				<div className="manageButtons">
					<button onClick={handleClick} className="buttonStart">
						Start Beats
					</button>
					<button className="buttonStart" onClick={stopGame}>
						Reset
					</button>
				</div>
			</main>
		</>
	);
}

export default App;
