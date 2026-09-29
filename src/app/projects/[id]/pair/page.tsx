"use client";

import { useState, use } from "react";
import { ArrowLeft, CheckCircle, ArrowRight } from "lucide-react";
import Link from "next/link";
import CloudinaryUpload from "@/components/ui/CloudinaryUpload";
import { saveBeforeAfterPair } from "../../actions";
import styles from "./page.module.css";
import BeforeAfter from "@/components/ui/BeforeAfter";

export default function CreatePairPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: projectId } = use(params);
  
  const [beforeAsset, setBeforeAsset] = useState<any>(null);
  const [afterAsset, setAfterAsset] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!beforeAsset || !afterAsset) return;
    setIsSubmitting(true);
    await saveBeforeAfterPair(projectId, beforeAsset, afterAsset);
  };

  return (
    <div className={styles.container}>
      <Link href={`/projects/${projectId}`} className={styles.backLink}>
        <ArrowLeft size={16} /> Back to Project
      </Link>

      <header className={styles.header}>
        <h1 className={styles.title}>Create Before/After Pair</h1>
        <p className={styles.subtitle}>Upload visual evidence of environmental impact.</p>
      </header>

      <div className={styles.uploadGrid}>
        <div className={`glass-panel ${styles.uploadCard}`}>
          <div className={styles.cardHeader}>
            <h3>1. Before Image</h3>
            {beforeAsset && <CheckCircle size={20} color="var(--color-accent-teal)" />}
          </div>
          {!beforeAsset ? (
            <CloudinaryUpload projectId={projectId} onUploadSuccess={(res) => setBeforeAsset(res)} />
          ) : (
            <div className={styles.assetPreview}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={beforeAsset.secure_url} alt="Before" />
              <button className={styles.removeButton} onClick={() => setBeforeAsset(null)}>Replace</button>
            </div>
          )}
        </div>

        <div className={styles.arrowContainer}>
          <ArrowRight size={32} color="var(--color-text-muted)" />
        </div>

        <div className={`glass-panel ${styles.uploadCard}`}>
          <div className={styles.cardHeader}>
            <h3>2. After Image</h3>
            {afterAsset && <CheckCircle size={20} color="var(--color-accent-teal)" />}
          </div>
          {!afterAsset ? (
            <CloudinaryUpload projectId={projectId} onUploadSuccess={(res) => setAfterAsset(res)} />
          ) : (
            <div className={styles.assetPreview}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={afterAsset.secure_url} alt="After" />
              <button className={styles.removeButton} onClick={() => setAfterAsset(null)}>Replace</button>
            </div>
          )}
        </div>
      </div>

      {beforeAsset && afterAsset && (
        <div className={styles.previewSection}>
          <h2 className={styles.sectionTitle}>Impact Preview</h2>
          <div className={styles.sliderWrapper}>
            <BeforeAfter beforeImage={beforeAsset.secure_url} afterImage={afterAsset.secure_url} />
          </div>
          
          <button 
            className={styles.submitButton} 
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving Evidence...' : 'Submit Impact Pair'}
          </button>
        </div>
      )}
    </div>
  );
}
