import React from "react";
import { useLocation } from "wouter";

export default function TherapistOffice() {
  const [, setLocation] = useLocation();

  return (
    <div style={{ padding: "1rem" }}>
      <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>
        Meet Your Therapist
      </h2>
      <video controls width="100%" style={{ borderRadius: "8px" }}>
        <source src="/EMDR.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div style={{ marginTop: "1.5rem" }}>
        <button
          style={{
            backgroundColor: "#008CBA",
            color: "white",
            padding: "12px 24px",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "1rem",
          }}
          onClick={() => {
            setLocation("/processing");
          }}
        >
          Begin Session
        </button>
      </div>
    </div>
  );
}