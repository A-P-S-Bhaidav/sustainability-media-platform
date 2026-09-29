'use client';

import { useState, useEffect } from 'react';
import { Camera, ChevronRight, X } from 'lucide-react';
import styles from './OnboardingTutorial.module.css';

const steps = [
  {
    title: "Welcome to EcoLens! 🌱",
    content: "This platform helps your team track and visualize the real-world impact of your sustainability projects.",
    position: "center",
  },
  {
    title: "1. The Dashboard",
    content: "Here you can monitor all your high-level statistics like total projects, media assets, and AI-generated tags.",
    position: "top",
  },
  {
    title: "2. Projects & Timelines",
    content: "Navigate to the Projects tab to view detailed timelines and interactive before/after visual reports.",
    position: "top",
  },
  {
    title: "3. AI Auto-Tagging",
    content: "Whenever you upload an image, our AI automatically tags it (e.g., 'solar-panel', 'field-work') so you can search for it later in AI Discovery.",
    position: "center",
  }
];

export default function OnboardingTutorial() {
  const [isVisible, setIsVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    // Only show if the user hasn't seen it before
    const hasSeenTutorial = localStorage.getItem('ecolens_tutorial_seen');
    if (!hasSeenTutorial) {
      // Delay slightly for dramatic effect
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleClose();
    }
  };

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem('ecolens_tutorial_seen', 'true');
  };

  if (!isVisible) return null;

  return (
    <div className={styles.overlay}>
      <div className={`${styles.tutorialBox} ${styles[steps[currentStep].position]}`}>
        <button className={styles.closeBtn} onClick={handleClose} aria-label="Close tutorial">
          <X size={18} />
        </button>
        <div className={styles.header}>
          <Camera size={24} color="var(--color-accent-teal)" />
          <span>Tutorial</span>
        </div>
        <h3 className={styles.title}>{steps[currentStep].title}</h3>
        <p className={styles.content}>{steps[currentStep].content}</p>
        
        <div className={styles.footer}>
          <div className={styles.dots}>
            {steps.map((_, i) => (
              <span key={i} className={`${styles.dot} ${i === currentStep ? styles.activeDot : ''}`} />
            ))}
          </div>
          <button className={styles.nextBtn} onClick={handleNext}>
            {currentStep === steps.length - 1 ? "Get Started" : "Next"} <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
