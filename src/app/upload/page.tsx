"use client";

import { useState } from "react";
import CloudinaryUpload from "@/components/ui/CloudinaryUpload";
import { FileImage, CheckCircle, AlertCircle } from "lucide-react";
import styles from "./page.module.css";

export default function UploadPage() {
  const [uploadedAssets, setUploadedAssets] = useState<any[]>([]);

  const handleUploadSuccess = async (result: any) => {
    setUploadedAssets((prev) => [...prev, result]);
    
    try {
      await fetch('/api/media', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(result) 
      });
    } catch (e) {
      console.error("Failed to save media to db", e);
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Upload Evidence</h1>
        <p className={styles.subtitle}>Upload field photos and videos. Cloudinary AI will automatically tag and analyze them.</p>
      </header>

      <div className={styles.uploadSection}>
        <CloudinaryUpload onUploadSuccess={handleUploadSuccess} />
      </div>

      {uploadedAssets.length > 0 && (
        <section className={styles.resultsSection}>
          <h2 className={styles.sectionTitle}>
            <CheckCircle className={styles.successIcon} /> 
            Successfully Uploaded ({uploadedAssets.length})
          </h2>
          
          <div className={styles.assetGrid}>
            {uploadedAssets.map((asset, index) => (
              <div key={asset.public_id || index} className={`glass-panel ${styles.assetCard}`}>
                <div className={styles.assetPreview}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={asset.secure_url} alt="Uploaded evidence" />
                </div>
                <div className={styles.assetInfo}>
                  <p className={styles.assetName}>{asset.original_filename}</p>
                  <p className={styles.assetFormat}>{asset.format} • {(asset.bytes / 1024 / 1024).toFixed(2)} MB</p>
                  
                  <div className={styles.tagsArea}>
                    <span className={styles.aiBadge}>AI Analyzed</span>
                    <p className={styles.tagsHint}>Tags are being extracted...</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
