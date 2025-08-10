import React, { useState, useEffect, useRef } from "react";
import BLSOptionBox from "@/components/BLSOptionBox";

export default function Processing() {
  const [blsType, setBlsType] = useState("visual");
  const [phase, setPhase] = useState("bls");
  const [userNote, setUserNote] = useState("");
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [positiveBelief, setPositiveBelief] = useState("");
  const [voc, setVoc] = useState(4);
  const [sessionNotes, setSessionNotes] = useState("");
  const [saved, setSaved] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const intervalRef = useRef<number | null>(null);
  const panRef = useRef<number>(-1);

  const playBeep = (panValue: number) => {
    const ctx = audioContextRef.current || new AudioContext();
    audioContextRef.current = ctx;

    const oscillator = ctx.createOscillator();
    const panNode = new StereoPannerNode(ctx, { pan: panValue });
    const gainNode = ctx.createGain();

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(440, ctx.currentTime);
    gainNode.gain.setValueAtTime(0.3, ctx.currentTime);

    oscillator.connect(panNode).connect(gainNode).connect(ctx.destination);
    oscillator.start();
    oscillator.stop(ctx.currentTime + 0.1);
  };

  useEffect(() => {
    if (isAudioPlaying) {
      intervalRef.current = window.setInterval(() => {
        panRef.current = -panRef.current;
        playBeep(panRef.current);
      }, 400);
      return () => clearInterval(intervalRef.current!);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
  }, [isAudioPlaying]);

  const handleSaveSession = () => {
    localStorage.setItem("emdrSessionNotes", sessionNotes);
    setSaved(true);
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
      <h2>EMDR Reprocessing</h2>

      <div style={{ marginBottom: "2rem" }}>
        <h3>Select BLS Mode:</h3>
        <div className="grid grid-cols-3 gap-4 mt-4">
          <BLSOptionBox
            type="visual"
            onClick={() => setBlsType("visual")}
            isSelected={blsType === "visual"}
            size="medium"
          />
          <BLSOptionBox
            type="auditory"
            onClick={() => setBlsType("audio")}
            isSelected={blsType === "audio"}
            size="medium"
          />
          <BLSOptionBox
            type="tapping"
            onClick={() => setBlsType("tapping")}
            isSelected={blsType === "tapping"}
            size="medium"
          />
        </div>
      </div>

      {blsType === "visual" && phase === "bls" && (
        <div style={{ marginTop: "2rem", height: "60px", overflow: "hidden", position: "relative" }}>
          <div
            style={{
              width: "30px",
              height: "30px",
              borderRadius: "50%",
              backgroundColor: "#0C2340",
              position: "absolute",
              animation: "blsBall 2s linear infinite",
            }}
          />
          <style>{`
            @keyframes blsBall {
              0% { left: 0; }
              50% { left: calc(100% - 30px); }
              100% { left: 0; }
            }
          `}</style>
        </div>
      )}

      {blsType === "audio" && phase === "bls" && (
        <div style={{ marginTop: "2rem" }}>
          <p>🔊 Auditory BLS</p>
          <button onClick={() => setIsAudioPlaying(true)}>Start Beeps</button>
          <button onClick={() => setIsAudioPlaying(false)} style={{ marginLeft: "1rem" }}>
            Stop Beeps
          </button>
        </div>
      )}

      {blsType === "tapping" && phase === "bls" && (
        <div style={{ marginTop: "2rem" }}>
          <p>👋 Use butterfly taps or tap thighs as guided.</p>
        </div>
      )}

      <div style={{ marginTop: "2rem" }}>
        <button onClick={() => {
          setIsAudioPlaying(false);
          setPhase("notice");
        }}>
          Stop BLS / What do you notice?
        </button>
      </div>

      {phase === "notice" && (
        <div style={{ marginTop: "2rem" }}>
          <textarea
            placeholder="Client: What are you noticing now?"
            rows={4}
            value={userNote}
            onChange={(e) => setUserNote(e.target.value)}
            style={{ width: "100%", padding: "1rem" }}
          />
          <div style={{ marginTop: "1rem" }}>
            <button onClick={() => {
              setUserNote("");
              setPhase("bls");
            }}>
              Go With That (start next round)
            </button>
            <button onClick={() => setPhase("install")} style={{ marginLeft: "1rem" }}>
              Ready to Install Positive Cognition
            </button>
          </div>
        </div>
      )}

      {phase === "install" && (
        <div style={{ marginTop: "2rem" }}>
          <h3>Positive Cognition</h3>
          <input
            type="text"
            value={positiveBelief}
            onChange={(e) => setPositiveBelief(e.target.value)}
            placeholder="e.g. I am safe now"
            style={{ width: "100%", padding: "0.5rem", marginBottom: "1rem" }}
          />
          <div>
            <label>VOC (1 = not true, 7 = totally true):</label>
            <input
              type="range"
              min={1}
              max={7}
              value={voc}
              onChange={(e) => setVoc(parseInt(e.target.value))}
              style={{ width: "100%" }}
            />
            <p>VOC rating: {voc}</p>
          </div>
          <button onClick={() => setPhase("bodyscan")}>
            Install Positive Belief with BLS
          </button>
        </div>
      )}

      {phase === "bodyscan" && (
        <div style={{ marginTop: "2rem" }}>
          <h3>Body Scan</h3>
          <p>Bring up the memory and the positive belief. Notice any tension in your body.</p>
          <button onClick={() => setPhase("closure")} style={{ marginTop: "1rem" }}>
            Complete Session
          </button>
        </div>
      )}

      {phase === "closure" && (
        <div style={{ marginTop: "2rem" }}>
          <h3>Calm Place and Save Notes</h3>
          <p>If the session is incomplete, take a moment to visualise your calm place.</p>
          <textarea
            placeholder="Notes, reflections, what was processed..."
            rows={4}
            value={sessionNotes}
            onChange={(e) => setSessionNotes(e.target.value)}
            style={{ width: "100%", padding: "1rem" }}
          />
          <div style={{ marginTop: "1rem" }}>
            <button onClick={handleSaveSession}>Save Session</button>
            {saved && <span style={{ marginLeft: "1rem", color: "green" }}>✅ Saved!</span>}
          </div>
        </div>
      )}
    </div>
  );
}