"use client";

import { useRef, useState } from "react";
import styles from "./DemoVideo.module.css";

export default function DemoVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  const handlePlay = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setPlaying(true);
    }
  };

  const handlePause = () => setPlaying(false);
  const handleEnded = () => setPlaying(false);

  return (
    <section className={styles.section}>
      <div className={styles.inner}>

        <div className={styles.top}>
          <div className={styles.eyebrow}>
            <span className={styles.dot} />
            See it in action
          </div>
          <h2 className={styles.heading}>Watch it work</h2>
          <p className={styles.sub}>
            From install to insight in under 30 seconds.
          </p>
        </div>

        <div className={styles.videoWrap}>
          <div className={styles.blob} />

          <div className={styles.browserBar}>
            <div className={styles.browserDots}>
              <span /><span /><span />
            </div>
            <div className={styles.browserUrl}>linkedin.com/jobs/view/…</div>
          </div>

          {/* Video */}
          <div className={styles.videoBox}>
            <video
              ref={videoRef}
              className={styles.video}
              src="/demo.mp4"
              playsInline
              controls={playing}
              onPause={handlePause}
              onEnded={handleEnded}
            />

            {!playing && (
              <button className={styles.playBtn} onClick={handlePlay} aria-label="Play demo">
                <div className={styles.playCircle}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M6 4l14 8-14 8V4z" fill="currentColor" />
                  </svg>
                </div>
                <span className={styles.playLabel}>Watch the demo</span>
              </button>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}