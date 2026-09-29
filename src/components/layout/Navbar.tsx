'use client';
import Link from 'next/link';
import { Camera, Search, User, LayoutDashboard } from 'lucide-react';
import { usePathname } from 'next/navigation';
import styles from './Navbar.module.css';

export default function Navbar() {
  const pathname = usePathname();

  // Hide Navbar completely on the landing page
  if (pathname === '/') return null;

  return (
    <nav className={styles.navbar}>
      <Link href="/dashboard" className={styles.logo}>
        <Camera size={24} className={styles.icon} color="var(--color-accent-teal)" />
        Eco<span>Lens</span>
      </Link>
      
      <div className={styles.links}>
        <Link href="/dashboard" className={`${styles.link} ${pathname === '/dashboard' ? styles.active : ''}`}>
          Dashboard
        </Link>
        <Link href="/projects" className={`${styles.link} ${pathname?.startsWith('/projects') ? styles.active : ''}`}>
          Projects
        </Link>
        <Link href="/search" className={`${styles.link} ${pathname === '/search' ? styles.active : ''}`}>
          AI Discovery
        </Link>
        <Link href="/reports" className={`${styles.link} ${pathname === '/reports' ? styles.active : ''}`}>
          Reports
        </Link>
      </div>
      
      <div className={styles.actions}>
        <Link href="/upload" className={`${styles.button} ${styles.primary}`}>
          Upload Media
        </Link>
        <Link href="/profile" className={`${styles.button} ${styles.secondary}`}>
          <User size={18} />
          Profile
        </Link>
      </div>
    </nav>
  );
}
