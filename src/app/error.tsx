"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCcw } from "lucide-react";
import styles from "./error.module.css";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // In an enterprise app, this goes to Sentry/Datadog
    console.error("Global Error Caught:", error);
  }, [error]);

  return (
    <div className={styles.container}>
      <div className={`glass-panel ${styles.errorCard}`}>
        <div className={styles.iconWrapper}>
          <AlertTriangle size={48} color="var(--color-accent-teal)" />
        </div>
        <h1 className={styles.title}>Something went wrong</h1>
        <p className={styles.description}>
          We encountered an unexpected error while processing your request. Our team has been notified.
        </p>
        <button
          onClick={() => reset()}
          className={styles.retryButton}
        >
          <RefreshCcw size={16} /> Try Again
        </button>
      </div>
    </div>
  );
}
