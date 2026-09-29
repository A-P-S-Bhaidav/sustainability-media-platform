"use client";

import { useState, useRef, useEffect, MouseEvent as ReactMouseEvent, TouchEvent as ReactTouchEvent } from "react";
import Image from "next/image";
import styles from "./BeforeAfter.module.css";

interface BeforeAfterProps {
  beforeImage: string;
  afterImage: string;
}

export default function BeforeAfter({ beforeImage, afterImage }: BeforeAfterProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (clientX: number) => {
    if (!isDragging || !containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = Math.max(0, Math.min((x / rect.width) * 100, 100));
    
    setSliderPosition(percent);
  };

  const handleMouseMove = (e: ReactMouseEvent) => {
    handleMove(e.clientX);
  };

  const handleTouchMove = (e: ReactTouchEvent) => {
    handleMove(e.touches[0].clientX);
  };

  useEffect(() => {
    const handleMouseUp = () => setIsDragging(false);
    
    if (isDragging) {
      window.addEventListener("mouseup", handleMouseUp);
      window.addEventListener("touchend", handleMouseUp);
    }
    
    return () => {
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchend", handleMouseUp);
    };
  }, [isDragging]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      setSliderPosition((prev) => Math.max(0, prev - 5));
    } else if (e.key === 'ArrowRight') {
      setSliderPosition((prev) => Math.min(100, prev + 5));
    }
  };

  return (
    <div 
      className={styles.container} 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
      onMouseLeave={() => setIsDragging(false)}
    >
      <Image 
        src={afterImage} 
        alt="After project completion" 
        fill
        style={{ objectFit: 'cover' }}
        className={styles.image} 
        draggable={false}
        sizes="(max-width: 768px) 100vw, 800px"
      />
      
      <div 
        className={styles.beforeContainer} 
        style={{ clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)` }}
      >
        <Image 
          src={beforeImage} 
          alt="Before project completion" 
          fill
          style={{ objectFit: 'cover' }}
          className={styles.image} 
          draggable={false} 
          sizes="(max-width: 768px) 100vw, 800px"
        />
      </div>

      <div 
        className={styles.slider} 
        style={{ left: `${sliderPosition}%` }}
        onMouseDown={() => setIsDragging(true)}
        onTouchStart={() => setIsDragging(true)}
      >
        <div 
          className={styles.sliderHandle}
          role="slider"
          tabIndex={0}
          aria-valuenow={Math.round(sliderPosition)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Image comparison slider"
          onKeyDown={handleKeyDown}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </div>
      </div>

      <div className={styles.labels}>
        <span className={styles.label} style={{ opacity: sliderPosition < 20 ? 0 : 1 }}>Before</span>
        <span className={styles.label} style={{ opacity: sliderPosition > 80 ? 0 : 1 }}>After</span>
      </div>
    </div>
  );
}
