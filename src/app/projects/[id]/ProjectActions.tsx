"use client";

import Link from "next/link";

export default function ProjectActions({ projectId }: { projectId: string }) {
  return (
    <div className="print-hide" style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
      <Link 
        href={`/projects/${projectId}/pair`} 
        style={{ padding: '0.5rem 1rem', background: 'var(--color-accent-teal)', color: '#000', borderRadius: '4px', fontWeight: 600, transition: 'all 0.2s', textDecoration: 'none' }}
      >
        + Create Impact Pair
      </Link>
      <button 
        onClick={() => {
          if (typeof window !== 'undefined') window.print();
        }} 
        style={{ padding: '0.5rem 1rem', border: '1px solid var(--color-border)', borderRadius: '4px', color: '#fff', fontWeight: 600, background: 'transparent', cursor: 'pointer', transition: 'all 0.2s' }}
      >
        Export Campaign PDF
      </button>
    </div>
  );
}
