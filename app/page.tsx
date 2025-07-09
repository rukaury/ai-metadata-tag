// app/page.tsx
"use client";

import { ThemeProvider } from "next-themes";
import "primeicons/primeicons.css";
import { Button } from "primereact/button";
import { Panel } from "primereact/panel";
import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import React, { useState } from "react";
import "./globals.css";

import {
  MediaControlBar,
  MediaController,
  MediaFullscreenButton,
  MediaMuteButton,
  MediaPlaybackRateButton,
  MediaPlayButton,
  MediaSeekBackwardButton,
  MediaSeekForwardButton,
  MediaTimeDisplay,
  MediaTimeRange,
  MediaVolumeRange,
} from "media-chrome/react";
import ReactPlayer from "react-player";

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
    <ThemeProvider defaultTheme="light" enableSystem={false}>
      <div className="app">
        <div className="video-section">
          <MediaController
            style={{
              width: "100%",
              aspectRatio: "16/9",
            }}
          >
            <ReactPlayer
              slot="media"
              src="https://stream.mux.com/maVbJv2GSYNRgS02kPXOOGdJMWGU1mkA019ZUjYE7VU7k"
              controls={false}
              style={{
                width: "100%",
                height: "100%",
              }}
            ></ReactPlayer>
            <MediaControlBar>
              <MediaPlayButton />
              <MediaSeekBackwardButton seekOffset={10} />
              <MediaSeekForwardButton seekOffset={10} />
              <MediaTimeRange />
              <MediaTimeDisplay showDuration />
              <MediaMuteButton />
              <MediaVolumeRange />
              <MediaPlaybackRateButton />
              <MediaFullscreenButton />
            </MediaControlBar>
          </MediaController>

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
    </ThemeProvider>
  );
};

export default HomePage;
