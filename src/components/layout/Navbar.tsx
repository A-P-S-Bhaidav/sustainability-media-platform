'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Camera, Menu, X, User } from 'lucide-react';
import { usePathname } from 'next/navigation';
import styles from './Navbar.module.css';

export default function Navbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Hide Navbar completely on the landing page
  if (pathname === '/') return null;

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Projects', path: '/projects' },
    { name: 'AI Discovery', path: '/search' },
    { name: 'Reports', path: '/reports' },
  ];

  return (
    <nav className={styles.navbar}>
      <div className={styles.navContainer}>
        {/* Logo */}
        <Link href="/dashboard" className={styles.logo}>
          <Camera size={26} className={styles.icon} color="var(--color-accent-teal)" />
          Eco<span>Lens</span>
        </Link>
        
        {/* Desktop Links */}
        <div className={styles.desktopLinks}>
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.path}
              prefetch={true}
              className={`${styles.link} ${
                (pathname === link.path || (link.path !== '/dashboard' && pathname?.startsWith(link.path)))
                  ? styles.active
                  : ''
              }`}
            >
              {link.name}
              {(pathname === link.path || (link.path !== '/dashboard' && pathname?.startsWith(link.path))) && (
                <div className={styles.underline} />
              )}
            </Link>
          ))}
        </div>
        
        {/* Desktop Actions */}
        <div className={styles.desktopActions}>
          <Link href="/upload" prefetch={true} className={`${styles.button} ${styles.primary}`}>
            Upload Media
          </Link>
          <Link href="/profile" prefetch={true} className={`${styles.button} ${styles.secondary}`}>
            <User size={18} />
            Profile
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className={styles.mobileToggle}
          onClick={(e) => {
            e.preventDefault();
            setIsMobileMenuOpen(!isMobileMenuOpen);
          }}
          aria-label="Toggle menu"
          aria-expanded={isMobileMenuOpen}
        >
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu Dropdown (CSS Driven) */}
      <div className={`${styles.mobileMenu} ${isMobileMenuOpen ? styles.mobileMenuOpen : ''}`}>
        <div className={styles.mobileLinks}>
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.path}
              prefetch={true}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`${styles.mobileLink} ${
                (pathname === link.path || (link.path !== '/dashboard' && pathname?.startsWith(link.path)))
                  ? styles.mobileActive
                  : ''
              }`}
            >
              {link.name}
            </Link>
          ))}
          <div className={styles.mobileActions}>
            <Link
              href="/upload"
              prefetch={true}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`${styles.button} ${styles.primary} ${styles.mobileButton}`}
            >
              Upload Media
            </Link>
            <Link
              href="/profile"
              prefetch={true}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`${styles.button} ${styles.secondary} ${styles.mobileButton}`}
            >
              <User size={18} /> Profile
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
