// app/page.tsx
"use client";

import { ThemeProvider } from "next-themes";
import "primeicons/primeicons.css";
import { Button } from "primereact/button";
import { FileUpload } from "primereact/fileupload";
import { Panel } from "primereact/panel";
import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import React, { useState, useRef } from "react";
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
  start: number;
  end: number;
  pos: number;
}

const HomePage: React.FC = () => {
  const mediaControllerRef = useRef<any>(null);

  const [tags, setTags] = useState<Tag[]>([
    { label: "Goal", start: 0, end: 30, pos: 10 },
    { label: "Crowd Reaction", start: 10, end: 45, pos: 40 },
    { label: "Interview", start: 20, end: 90, pos: 75 },
  ]);
  const [uploadVisible, setUploadVisible] = useState(false);
  const handleUploadClick = () => {
    setUploadVisible(true);
  };

  const jumpToTimestamp = (seconds: number) => {
    if (mediaControllerRef.current?.media) {
      mediaControllerRef.current.media.currentTime = seconds;
    }
  };

  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60)
      .toString()
      .padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  return (
    <ThemeProvider defaultTheme="light" enableSystem={false}>
      <div className="app">
        <div className="video-section">
          <MediaController
            ref={mediaControllerRef}
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
            />
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
            <Button label="Live Feed" className="p-2" />
            <FileUpload
              mode="basic"
              name="video"
              accept="video/*"
              chooseLabel="Upload Video"
              customUpload
              auto
              className="p-2"
            />
          </div>
        </div>

        <div className="metadata-feed">
          <Panel header="Metadata Feed">
            <ul>
              {tags.map((tag, idx) => (
                <li key={idx}>
                  <strong
                    onClick={() => jumpToTimestamp(tag.start)}
                    style={{ cursor: "pointer", color: "#2196f3" }}
                    title={`Jump to ${formatTime(tag.start)}`}
                  >
                    {tag.label}
                  </strong>
                  : {formatTime(tag.start)} - {formatTime(tag.end)}
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
