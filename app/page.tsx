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
  tagName: string;
  startTime: number;
  endTime: number;
  confidence: number;
}

const HomePage: React.FC = () => {
  const mediaControllerRef = useRef<any>(null);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  const [tags, setTags] = useState<Tag[]>([]);
  const [isDetecting, setIsDetecting] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);

  const handleDetectLabels = async () => {
    setIsDetecting(true);
    try {
      const response = await fetch("/api/detect-labels");
      if (!response.ok) {
        throw new Error("Failed to fetch labels");
      }
      const newTags = await response.json();
      console.log("wowwowwowwowwowwowwow");
      setTags(newTags);
    } catch (error) {
      console.error("Error detecting labels:", error);
    } finally {
      setIsDetecting(false);
    }
  };

  const jumpToTimestamp = (seconds: number) => {
    if (mediaControllerRef.current?.media) {
      mediaControllerRef.current.media.currentTime = seconds;
      mediaControllerRef.current.media.play();
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
      console.error("Upload failed silently:", err);
    } finally {
      // Always trigger label detection after attempting upload
      await handleDetectLabels();
    }
  };

  const setMediaControllerRef = (element: any) => {
    mediaControllerRef.current = element;
    if (element?.media) {
      const media = element.media;
      const handleLoadedMetadata = () => {
        if (media.duration && media.duration !== Infinity) {
          setDuration(media.duration);
        }
      };
      const handleTimeUpdate = () => {
        setCurrentTime(media.currentTime);
      };

      media.addEventListener("loadedmetadata", handleLoadedMetadata);
      media.addEventListener("timeupdate", handleTimeUpdate);

      if (media.readyState >= 1) {
        handleLoadedMetadata();
      }
    }
  };

  return (
    <ThemeProvider attribute="data-theme" defaultTheme="light">
      <div className="app">
        <div className="video-section">
          <div className="video-player-container">
            <MediaController
              ref={setMediaControllerRef}
              className="media-controller"
              style={{
                aspectRatio: "16 / 9",
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
          </div>

          <div className="controls-section">
            <div className="timeline">
              <div
                className="timeline-progress"
                style={{ width: `${(currentTime / duration) * 100}%` }}
              />
              {duration > 0 &&
                tags.map((tag, idx) => {
                  const left = (tag.startTime / duration) * 100;
                  return (
                    <div
                      key={idx}
                      className="tag-marker"
                      style={{
                        left: `${left}%`,
                      }}
                      onClick={() => jumpToTimestamp(tag.startTime)}
                      title={`${tag.tagName}: ${formatTime(tag.startTime)}`}
                    >
                      <div className="tag-label">{tag.tagName}</div>
                    </div>
                  );
                })}
            </div>

            <div className="buttons">
              <Button label="Live Feed" />
              <FileUpload
                name="video"
                mode="basic"
                accept="video/*"
                customUpload
                uploadHandler={handleCustomUpload}
                auto
                chooseLabel="Upload Video"
              />
            </div>
          </div>
        </div>

        <div className="metadata-feed">
          <Panel header="Metadata Feed">
            <ul>
              {tags.map((tag, idx) => (
                <li key={idx}>
                  <strong
                    onClick={() => jumpToTimestamp(tag.startTime)}
                    title={`Jump to ${formatTime(tag.startTime)}`}
                  >
                    {tag.tagName}
                  </strong>
                  : {formatTime(tag.startTime)} - {formatTime(tag.endTime)}
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
