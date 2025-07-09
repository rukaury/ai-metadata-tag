// app/page.tsx
"use client";

import "primeicons/primeicons.css";
import { Button } from "primereact/button";
import { Panel } from "primereact/panel";
import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import React, { useState } from "react";
import "./globals.css";

interface Tag {
  label: string;
  start: string;
  end: string;
  pos: number;
}

const HomePage: React.FC = () => {
  const [tags, setTags] = useState<Tag[]>([
    { label: "Goal", start: "0:00", end: "0:30", pos: 10 },
    { label: "Crowd Reaction", start: "0:30", end: "0:45", pos: 40 },
    { label: "Interview", start: "0:45", end: "1:30", pos: 75 },
  ]);

  return (
    <div className="app">
      <div className="video-section">
        <Panel header="Video Player">
          <div className="video-placeholder">Video</div>
          <div className="timeline">
            {tags.map((tag, idx) => (
              <div
                key={idx}
                className="tag-marker"
                style={{ left: `${tag.pos}%` }}
              >
                <div className="tag-label">{tag.label}</div>
              </div>
            ))}
            <div className="progress-line"></div>
          </div>
        </Panel>

        <div className="buttons">
          <Button label="Live Feed" className="p-button-outlined" />
          <Button label="Upload Video" className="p-button-outlined" />
        </div>
      </div>

      <div className="metadata-feed">
        <Panel header="Metadata Feed">
          <ul>
            {tags.map((tag, idx) => (
              <li key={idx}>
                <strong>{tag.label}</strong>: {tag.start} - {tag.end}
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </div>
  );
};

export default HomePage;
