import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";

const SoundEffect = forwardRef((_props, ref) => {
  const audioRef = useRef(null);

  const handlePlay = useCallback(() => {
    const audio = new Audio("heartbeat.mp3");
    audio.play();
  }, []);

  useImperativeHandle(ref, () => ({
    play: handlePlay,
  }));

  return (
    <div className="containerSound">
      <audio ref={audioRef}>
        <source src="heartbeat.mp3" type="audio/mpeg" />
        <p>Your browser does not support the audio element.</p>
      </audio>
    </div>
  );
});

export default SoundEffect;
