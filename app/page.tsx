"use client";

import Image from "next/image";
import styles from "./page.module.css";
import { useEffect, useRef, useState } from "react";

export default function Home() {
  const [dataMouseDownPoint, setDataMouseDownPoint] = useState<number>(0);
  const [dataMouseMovePoint, setDataMouseMovePoint] = useState<number>(0);
  const [percentage, setPercentage] = useState<number>(0);
  const [lastPercentage, setLastPercentage] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const imageTracker = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.addEventListener("mousedown", handleOnMouseDown);
    window.addEventListener("mouseup", handleOnMouseUp);
    window.addEventListener("mousemove", handleOnMouseMove);

    return () => {
      window.removeEventListener("mousedown", handleOnMouseDown);
      window.removeEventListener("mouseup", handleOnMouseUp);
      window.removeEventListener("mousemove", handleOnMouseMove);
    };
  }, []);

  useEffect(() => {
    if (isDragging) {
      const mouseDelta =
        parseFloat(String(dataMouseDownPoint)) - dataMouseMovePoint;
      const maxDelta = window.innerWidth / 2;
      const percentage =
        parseFloat(String(lastPercentage)) + (mouseDelta / maxDelta) * -100;
      if (imageTracker.current && percentage < 0 && percentage > -100) {
        const imageTrackDiv = imageTracker.current;

        imageTrackDiv.style.transform = `translate(${percentage}%, -50%)`;
      }

      setPercentage(percentage);
    }
  }, [dataMouseDownPoint, dataMouseMovePoint, isDragging]);

  useEffect(() => {
    if (!isDragging) {
      setLastPercentage(percentage);
    }
    if (percentage > 0) {
      setLastPercentage(0);
    } else if (percentage < -100) {
      setLastPercentage(-100);
    }
  }, [isDragging]);

  const handleOnMouseUp = () => {
    setIsDragging(false);
  };

  const handleOnMouseDown = (event: any) => {
    setIsDragging(true);
    setDataMouseDownPoint(event.clientX);
    document.documentElement.style.setProperty("--my-variable-name", "pink");
  };

  const handleOnMouseMove = (event: any) => {
    setDataMouseMovePoint(event.clientX);
  };

  const images = () => {
    const elements = [];
    for (let index = 1; index <= 8; index++) {
      elements.push(
        <div key={`image-${index}`} className={styles.image}>
          <Image
            src={`/posters/poster-${index}.jpg`}
            alt="Vercel Logo"
            className={styles.image}
            width={500}
            height={500}
            draggable={false}
          />
        </div>
      );
    }
    return elements;
  };

  return (
    <main className={styles.main}>
      <div ref={imageTracker} className={styles.imageTrack}>
        {images()}
      </div>
    </main>
  );
}
