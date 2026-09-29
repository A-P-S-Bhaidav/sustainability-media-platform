"use client";

import { useState } from "react";
import { Download, FileText, Share2, BarChart2 } from "lucide-react";
import styles from "./page.module.css";

export default function ReportsPage() {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      // In a real app, this would trigger a PDF download or open a new window
      alert("Report generation complete!");
    }, 2000);
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Visual Impact Reports</h1>
        <p className={styles.subtitle}>Generate stunning, data-driven reports for your donors and stakeholders.</p>
      </header>

      <div className={styles.actions}>
        <button 
          className={styles.generateButton}
          onClick={handleGenerate}
          disabled={isGenerating}
        >
          {isGenerating ? "Generating AI Report..." : "Generate Monthly Impact Report"}
        </button>
      </div>

      <div className={styles.reportsGrid}>
        {/* Mock Report 1 */}
        <div className={`glass-panel ${styles.reportCard}`}>
          <div className={styles.reportIcon}>
            <FileText size={40} color="var(--color-accent-teal)" />
          </div>
          <div className={styles.reportContent}>
            <h3 className={styles.reportTitle}>Q3 2026 Coastal Reforestation</h3>
            <p className={styles.reportMeta}>Generated Oct 1, 2026 • PDF • 4.2 MB</p>
          </div>
          <div className={styles.reportActions}>
            <button className={styles.iconButton} title="Download">
              <Download size={18} />
            </button>
            <button className={styles.iconButton} title="Share">
              <Share2 size={18} />
            </button>
          </div>
        </div>

        {/* Mock Report 2 */}
        <div className={`glass-panel ${styles.reportCard}`}>
          <div className={styles.reportIcon}>
            <BarChart2 size={40} color="var(--color-accent-blue)" />
          </div>
          <div className={styles.reportContent}>
            <h3 className={styles.reportTitle}>Annual Sustainability Review</h3>
            <p className={styles.reportMeta}>Generated Jan 15, 2026 • Interactive</p>
          </div>
          <div className={styles.reportActions}>
            <button className={styles.iconButton} title="Download">
              <Download size={18} />
            </button>
            <button className={styles.iconButton} title="Share">
              <Share2 size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
