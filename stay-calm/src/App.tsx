import { useEffect, useState, useRef } from "react";
import Beat from "./Beat";
import React from "react";
import SoundEffect from "./SoundEffect";

/* App built by StarPlatinumSan, also known as Andrei Bituleanu. */
/* It's goal is to reproduce the stay calm quick time events from The Dark Pictures Anthology Games, a series by Supermassive Games. */

function App() {
  const [beats, setBeats] = useState<JSX.Element[]>([]);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [isDifficultyButtonDisabled, setIsDifficultyButtonDisabled] = useState<boolean>(false);
  const [spaceBarAllowed, setSpaceBarAllowed] = useState<boolean>(false);

  const [animSpeed, setAnimSpeed] = useState<number>(6);
  const [typeBeat, setTypeBeat] = useState<string>("medium");
  const [pairBeatGap, setPairBeatGap] = useState<number>(800);
  const [beatGap, setBeatGap] = useState<number>(2000);
  const [repetition, setRepetition] = useState<number>(16);
  const lvlRef = useRef<HTMLDivElement>(null);
  const timeoutsRef = useRef<number[]>([]);
  const soundEffectRef = useRef<any>(null);

  const [, setBeatStatus] = useState<{ [key: number]: boolean }>({});

  const centerDivRef = useRef<HTMLDivElement>(null);

  let currentBeatIndexRef = useRef<number>(0);

  let beatRefs = useRef<(HTMLDivElement | null)[]>([]);

  const clearBeats = () => {
    setBeats([]);
    beatRefs.current = [];
  };

  const handleClick = () => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];

    clearBeats();

    setIsActive((prev) => !prev);

    const element = document.getElementById("fail");
    if (element) {
      element.style.transform = "translate(-50%, -100%)";
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

    beatRefs.current.forEach((beatRef) => {
      if (beatRef) {
        beatRef.style.animationPlayState = "paused";
      }
    });

    clearBeats();
    currentBeatIndexRef.current = 0;
    setIsActive(false);
    setIsDifficultyButtonDisabled(false);
    setSpaceBarAllowed(false);
  };

  const handleDifficulty = () => {
    const diff = document.getElementById("lvl");
    if (diff) {
      diff.style.transform = "translate(0, -50%)";
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

    if (clickedButton.id !== "custom") {
      if (clickedButton.id === "easy") {
        setAnimSpeed(10);
        setTypeBeat("large");
        setPairBeatGap(800);
        setBeatGap(2000);
        setRepetition(16);
      } else if (clickedButton.id === "medium") {
        setAnimSpeed(6);
        setTypeBeat("medium");
        setPairBeatGap(400);
        setBeatGap(1400);
        setRepetition(16);
      } else if (clickedButton.id === "hard") {
        setAnimSpeed(4.5);
        setTypeBeat("medium");
        setPairBeatGap(300);
        setBeatGap(500);
        setRepetition(24);
      } else if (clickedButton.id === "extreme") {
        setAnimSpeed(2.5);
        setTypeBeat("medium");
        setPairBeatGap(200);
        setBeatGap(500);
        setRepetition(32);
      } else if (clickedButton.id === "agony") {
        setAnimSpeed(1);
        setTypeBeat("small");
        setPairBeatGap(150);
        setBeatGap(500);
        setRepetition(32);
      } else {
        setAnimSpeed(15);
        setTypeBeat("small");
        setPairBeatGap(150);
        setBeatGap(500);
        setRepetition(32);
      }
    }
  };

  const handleCustomSpeed = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleOrangeButton();
    setAnimSpeed(Number(event.target.value));

    if (animSpeed >= 7) {
      setPairBeatGap(800);
      setBeatGap(2000);
    }
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

      timeoutsRef.current.forEach(clearTimeout);
      timeoutsRef.current = [];
      clearBeats();

      const customBtn = document.getElementById("custom");

      if (customBtn) {
        if (customBtn.style.backgroundColor === "orange" && animSpeed >= 5) {
          setPairBeatGap(800);
          setBeatGap(2000);
        }
      }

      const animationDuration = animSpeed * 1000;

      let beatCounter = 0;

      const addFirstBeat = () => {
        const uniqueId = Date.now() + beatCounter;

        setBeats((prevBeats) => [...prevBeats, <Beat key={uniqueId} ref={(el) => (beatRefs.current[beatCounter] = el)} type={typeBeat} animationSpeed={animSpeed} data-index={beatCounter} />]);
        beatCounter++;
      };

      const addBeatPair = () => {
        const uniqueId = Date.now() + beatCounter;

        setBeats((prevBeats) => [...prevBeats, <Beat key={uniqueId} ref={(el) => (beatRefs.current[beatCounter] = el)} type={typeBeat} animationSpeed={animSpeed} data-index={beatCounter} />]);
        beatCounter++;

        const secondBeatTimeout = setTimeout(() => {
          setBeats((prevBeats) => [...prevBeats, <Beat key={uniqueId + 1} ref={(el) => (beatRefs.current[beatCounter] = el)} type={typeBeat} animationSpeed={animSpeed} data-index={beatCounter} />]);
          beatCounter++;

          if (beatCounter < repetition) {
            if (animSpeed > 7) {
              setPairBeatGap(800);
              setBeatGap(2000);
            }
            const nextBeatTimeout = setTimeout(addBeatPair, pairBeatGap);
            timeoutsRef.current.push(nextBeatTimeout);
          } else {
            const totalAnimationTime = animationDuration;
            const enableDifficultyTimeout = setTimeout(() => {
              setIsDifficultyButtonDisabled(false);
              setSpaceBarAllowed(false);
              checkBeatsCompletion();
              stopGame();
            }, totalAnimationTime);

            timeoutsRef.current.push(enableDifficultyTimeout);
          }
        }, beatGap);

        timeoutsRef.current.push(secondBeatTimeout);
      };

      addFirstBeat();

      const firstPairTimeout = setTimeout(addBeatPair, pairBeatGap);
      timeoutsRef.current.push(firstPairTimeout);

      return () => {
        timeoutsRef.current.forEach(clearTimeout);
        timeoutsRef.current = [];
      };
    }
  }, [isActive, animSpeed, typeBeat, pairBeatGap, beatGap, repetition]);

  const checkBeatPosition = () => {
    if (spaceBarAllowed) {
      const centerDiv = centerDivRef.current?.getBoundingClientRect();

      let adjustedIndex = currentBeatIndexRef.current + 1;

      const beatRefCurrent = beatRefs.current[adjustedIndex];
      console.log("Current Beat Index:", adjustedIndex);

      if (beatRefCurrent) {
        const beatRect = beatRefCurrent.getBoundingClientRect();

        currentBeatIndexRef.current += 1;

        if (!centerDiv) {
          return;
        }

        if (beatRect.left < centerDiv.right && beatRect.right > centerDiv.left) {
          console.log("Beat", adjustedIndex, "is overlapping!");
          if (soundEffectRef.current) {
            soundEffectRef.current.play();
          }

          successBeat(beatRefCurrent);
          setBeatStatus((prev) => ({ ...prev, [adjustedIndex]: true }));
        } else {
          console.log("Beat", adjustedIndex, "is not overlapping");
          failedBeat(beatRefCurrent);
        }
      } else {
        console.log("Beat reference not found");
      }
    }
  };

  const successBeat = (beatRefCurrent: HTMLDivElement) => {
    beatRefCurrent.style.transition = "background-color 0.2s ease";
    beatRefCurrent.style.backgroundColor = "cyan";

    const index = parseInt(beatRefCurrent.dataset.index as string, 10);
    if (!isNaN(index)) {
      setBeatStatus((prev) => ({
        ...prev,
        [index]: true,
      }));
    }
  };

  const failedBeat = (beatRefCurrent: HTMLDivElement) => {
    beatRefCurrent.style.transition = "background-color 0.2s ease";
    beatRefCurrent.style.backgroundColor = "darkred";
    failedStopGame();
    failureMessage();

    beatRefs.current.forEach((beatRef) => {
      if (beatRef) {
        beatRef.style.animationPlayState = "paused";
      }
    });
  };

  const checkBeatsCompletion = () => {
    console.log("Checking beats completion...");

    let allBeatsHandled = true;

    beatRefs.current.forEach((beatRef) => {
      if (beatRef) {
        const computedStyle = window.getComputedStyle(beatRef);
        const backgroundColor = computedStyle.backgroundColor;

        console.log(`Beat background color: ${backgroundColor}`);

        if (backgroundColor !== "rgb(0, 255, 255)") {
          allBeatsHandled = false;
        }
      }
    });

    if (allBeatsHandled) {
      console.log("All beats handled successfully.");
    } else {
      failureMessage();
      console.log("Not all beats are handled.");
    }

    setBeatStatus({});
    beatRefs.current = [];
  };

  const failureMessage = () => {
    const message = document.getElementById("fail");

    if (!message) return;

    message.style.transform = "translate(-50%, 15%)";

    setTimeout(function () {
      message.style.transform = "translate(-50%, -100%)";
    }, 3000);
  };

  const failedStopGame = () => {
    timeoutsRef.current.forEach((timeoutId) => clearTimeout(timeoutId));
    timeoutsRef.current = [];

    beatRefs.current.forEach((beatRef) => {
      if (beatRef) {
        beatRef.style.animationPlayState = "paused";
      }
    });

    currentBeatIndexRef.current = 0;
    setIsActive(false);
    setIsDifficultyButtonDisabled(false);
    setSpaceBarAllowed(false);
  };

  useEffect(() => {
    const handleSpacebarPress = (event: KeyboardEvent) => {
      if (event.key === " " && spaceBarAllowed) {
        event.preventDefault();
        checkBeatPosition();
      }
    };

    const handleClickMouse = () => {
      if (spaceBarAllowed) {
        checkBeatPosition();
      }
    };

    window.addEventListener("keydown", handleSpacebarPress);
    window.addEventListener("click", handleClickMouse);

    return () => {
      window.removeEventListener("keydown", handleSpacebarPress);
      window.removeEventListener("click", handleClickMouse);
    };
  }, [spaceBarAllowed, beats]);

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

  const handleGame = (event: KeyboardEvent | MouseEvent) => {
    if (((event.type === "keydown" && (event as KeyboardEvent).code === "Space") || (event.type === "mousedown" && (event as MouseEvent).button === 0)) && spaceBarAllowed && isActive) {
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
        <div className="failureMessage" id="fail">
          <h2>You failed.</h2>
        </div>
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
              <input type="range" id="speedRange" className="rangeInput" min={1} max={10} step={0.5} value={animSpeed} onChange={handleCustomSpeed} />
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

            <SoundEffect ref={soundEffectRef} />
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

        <span className="author">
          By <a href="https://github.com/StarPlatinumSan">StarPlatinumSan</a>
        </span>
      </main>
    </>
  );
}

export default React.memo(App);
