import { Loader2 } from "lucide-react";

export default function GlobalLoading() {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 'calc(100vh - 64px)',
      flexDirection: 'column',
      gap: '1rem',
      color: 'var(--color-text-secondary)'
    }}>
      <Loader2 size={32} style={{ animation: 'spin 1s linear infinite' }} />
      <p>Loading application data...</p>
    </div>
  );
}
