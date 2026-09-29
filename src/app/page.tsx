import Link from 'next/link';
import { Camera, ChevronRight, BarChart3, Globe, ShieldCheck } from 'lucide-react';
import styles from './landing.module.css';
import { signIn, auth } from '@/auth';
import { redirect } from 'next/navigation';

export default async function LandingPage() {
  const session = await auth();
  
  if (session?.user) {
    redirect('/dashboard');
  }

  return (
    <div className={styles.landingContainer}>
      <div className={styles.heroSection}>
        <nav className={styles.topNav}>
          <div className={styles.logo}>
            <Camera size={28} className={styles.icon} color="var(--color-accent-teal)" />
            Eco<span>Lens</span>
          </div>
          <form
            action={async () => {
              "use server"
              await signIn("google")
            }}
          >
            <button type="submit" className={styles.loginBtn}>Login</button>
          </form>
        </nav>

        <div className={styles.heroContent}>
          <div className={styles.badge}>Next-Gen Sustainability Platform</div>
          <h1 className={styles.headline}>
            Visualize Your <br/>
            <span className={styles.highlight}>Environmental Impact</span>
          </h1>
          <p className={styles.subhead}>
            EcoLens uses AI to automatically organize, tag, and generate stunning before-and-after reports of your field operations.
          </p>
          
          <form
            action={async () => {
              "use server"
              await signIn("google")
            }}
            className={styles.ctaWrapper}
          >
            <button type="submit" className={styles.primaryCta}>
              Get Started <ChevronRight size={18} />
            </button>
          </form>
        </div>
      </div>

      <div className={styles.featureSection}>
        <div className={styles.featureGrid}>
          <div className={`glass-panel ${styles.featureCard}`}>
            <BarChart3 size={32} color="var(--color-accent-teal)" />
            <h3>Real-Time Dashboard</h3>
            <p>Track total projects, media assets, and AI-generated tags dynamically as your team uploads from the field.</p>
          </div>
          <div className={`glass-panel ${styles.featureCard}`}>
            <Globe size={32} color="var(--color-accent-blue)" />
            <h3>Interactive Comparisons</h3>
            <p>Showcase the before and after of your sustainability efforts using our interactive image sliders.</p>
          </div>
          <div className={`glass-panel ${styles.featureCard}`}>
            <ShieldCheck size={32} color="var(--color-accent-purple)" />
            <h3>Enterprise Security</h3>
            <p>Built with NextAuth and robust session management to ensure your project data remains entirely secure.</p>
          </div>
        </div>
      </div>

      <footer className={styles.footer}>
        <p>&copy; {new Date().getFullYear()} EcoLens. All rights reserved.</p>
      </footer>
    </div>
  );
}
