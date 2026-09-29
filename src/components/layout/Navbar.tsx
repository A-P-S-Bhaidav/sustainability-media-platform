'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Camera, Menu, X, User } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import styles from './Navbar.module.css';

export default function Navbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  // Hide Navbar completely on the landing page
  if (pathname === '/') return null;

  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > 10 && !scrolled) {
      setScrolled(true);
    } else if (latest <= 10 && scrolled) {
      setScrolled(false);
    }
  });

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Projects', path: '/projects' },
    { name: 'AI Discovery', path: '/search' },
    { name: 'Reports', path: '/reports' },
  ];

  return (
    <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}>
      <div className={styles.navContainer}>
        {/* Logo */}
        <Link href="/dashboard" className={styles.logo}>
          <motion.div
            whileHover={{ rotate: 180 }}
            transition={{ duration: 0.3 }}
          >
            <Camera size={26} className={styles.icon} color="var(--color-accent-teal)" />
          </motion.div>
          Eco<span>Lens</span>
        </Link>
        
        {/* Desktop Links */}
        <div className={styles.desktopLinks}>
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.path}
              className={`${styles.link} ${
                (pathname === link.path || (link.path !== '/dashboard' && pathname?.startsWith(link.path)))
                  ? styles.active
                  : ''
              }`}
            >
              {link.name}
              {(pathname === link.path || (link.path !== '/dashboard' && pathname?.startsWith(link.path))) && (
                <motion.div layoutId="underline" className={styles.underline} />
              )}
            </Link>
          ))}
        </div>
        
        {/* Desktop Actions */}
        <div className={styles.desktopActions}>
          <Link href="/upload" className={`${styles.button} ${styles.primary}`}>
            Upload Media
          </Link>
          <Link href="/profile" className={`${styles.button} ${styles.secondary}`}>
            <User size={18} />
            Profile
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className={styles.mobileToggle}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className={styles.mobileMenu}
          >
            <div className={styles.mobileLinks}>
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.path}
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
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`${styles.button} ${styles.primary} ${styles.mobileButton}`}
                >
                  Upload Media
                </Link>
                <Link
                  href="/profile"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`${styles.button} ${styles.secondary} ${styles.mobileButton}`}
                >
                  <User size={18} /> Profile
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
