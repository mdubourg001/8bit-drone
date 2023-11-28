import { useCallback, useState, useMemo, useEffect, useRef } from "react";

// ----- CONSTANTS -----

const NOTES = [
  "C",
  "C#",
  "Db",
  "D",
  "D#",
  "Eb",
  "E",
  "F",
  "F#",
  "Gb",
  "G",
  "G#",
  "Ab",
  "A",
  "A#",
  "Bb",
  "B",
];

// ----- MUSIC -----

// ----- APP -----

export default function App() {
  const [notes, setNotes] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const player = useRef(null);

  useEffect(() => {
    if (player.current && isPlaying) {
      player.current.stop(false);
      player.current = null;
    }

    if (notes.length === 0) {
      document.title = `8bit Drone`;

      return;
    } else {
      document.title = `[${notes.join(", ")}] | 8bit Drone`;
    }

    const conductor = new BandJS();
    conductor.setTimeSignature(4, 4);
    conductor.setTempo(1);

    for (const note of notes) {
      const instrument = conductor.createInstrument();

      try {
        instrument.note("whole", note, true);
      } catch (error) {
        alert(error);
      }
    }

    player.current = conductor.finish();
    player.current.loop(true);

    if (isPlaying) {
      player.current.play();
    }
  }, [notes, isPlaying]);

  return (
    <section
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        margin: "auto",
        rowGap: "50px",
      }}
    >
      <h1 style={{ fontSize: "30px", margin: 0 }}>8bit Drone</h1>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          margin: "auto",
          rowGap: "30px",
          overflowX: "scroll",
        }}
      >
        {[2, 3, 4, 5, 6, 7].map((octave) => (
          <div
            key={octave}
            className="notes__grid"
            style={{
              display: "grid",
              columnGap: "5px",
            }}
          >
            {NOTES.map((note) => {
              const pitch = `${note}${octave}`;

              return (
                <button
                  key={note}
                  style={{
                    border: notes.includes(pitch)
                      ? "3px solid orange"
                      : "3px solid lightgrey",
                    fontSize: "20px",
                    borderRadius: "5px",
                  }}
                  onClick={() => {
                    setNotes((actual) =>
                      actual.includes(pitch)
                        ? actual.filter((n) => n !== pitch)
                        : [...actual, pitch]
                    );

                    if (notes.length === 0) {
                      setIsPlaying(true);
                    }
                  }}
                >
                  {pitch}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      <div style={{ display: "flex", columnGap: "30px" }}>
        {notes.length > 0 && (
          <button
            style={{ fontSize: "30px", fontWeight: "bold" }}
            onClick={() => {
              if (isPlaying) {
                player.current?.stop(false);
              }

              setNotes([]);
              setIsPlaying(false);
            }}
          >
            RESET
          </button>
        )}

        <button
          style={{ fontSize: "30px", fontWeight: "bold" }}
          disabled={!isPlaying && notes.length === 0}
          onClick={() => {
            if (isPlaying) {
              player.current?.stop(false);
            }

            setIsPlaying(!isPlaying);
          }}
        >
          {isPlaying ? "PAUSE" : "PLAY"}
        </button>
      </div>
    </section>
  );
}
