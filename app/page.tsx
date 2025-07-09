// app/page.tsx
"use client";

import { ThemeProvider } from "next-themes";
import "primeicons/primeicons.css";
import { Button } from "primereact/button";
import { FileUpload, FileUploadHandlerEvent } from "primereact/fileupload";
import { Panel } from "primereact/panel";
import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import React, { useRef, useState } from "react";
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
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);

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

  const handleCustomUpload = async (event: FileUploadHandlerEvent) => {
    const file = event.files[0];
    const fileName = encodeURIComponent(file.name);

    try {
      // Step 1: Get signed URL from your backend
      const res = await fetch(
        `/api/upload-url?fileName=${fileName}&fileType=${file.type}`
      );
      const { url, key } = await res.json();

      // Step 2: Upload the file directly to S3
      await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": file.type,
        },
        body: file,
      });

      setUploadedFileName(key);
    } catch (err) {
      console.error("Upload failed:", err);
    }
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
              uploadHandler={handleCustomUpload}
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
