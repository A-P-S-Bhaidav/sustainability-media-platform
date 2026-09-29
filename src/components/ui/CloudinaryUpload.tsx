"use client";

import { CldUploadWidget } from "next-cloudinary";
import { UploadCloud } from "lucide-react";
import styles from "./CloudinaryUpload.module.css";

interface CloudinaryUploadProps {
  onUploadSuccess: (result: any) => void;
  projectId?: string;
}

export default function CloudinaryUpload({ onUploadSuccess, projectId }: CloudinaryUploadProps) {
  return (
    <CldUploadWidget 
      uploadPreset="impact_media_preset"
      options={{
        multiple: true,
        maxFiles: 10,
        folder: `impact_hub/${projectId || 'general'}`,
        tags: ["field_evidence", "ai_analysis_pending"],
      }}
      onSuccess={(result) => {
        onUploadSuccess(result.info);
      }}
    >
      {({ open }) => {
        return (
          <button className={styles.uploadArea} onClick={() => open()}>
            <div className={styles.iconContainer}>
              <UploadCloud size={48} color="var(--color-accent-teal)" />
            </div>
            <h3 className={styles.title}>Click to upload or drag and drop</h3>
            <p className={styles.subtitle}>SVG, PNG, JPG or GIF (max. 800x400px)</p>
            <p className={styles.aiNotice}>
              ✨ Media will be automatically tagged and analyzed by Cloudinary AI
            </p>
          </button>
        );
      }}
    </CldUploadWidget>
  );
}
