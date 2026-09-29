import { auth, signOut } from '@/auth';
import { redirect } from 'next/navigation';
import Image from 'next/image';
import { LogOut, Mail, User as UserIcon } from 'lucide-react';
import styles from './page.module.css';

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user) redirect('/');

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Your Profile</h1>
        <p className={styles.subtitle}>Manage your account and preferences.</p>
      </header>

      <div className={`glass-panel ${styles.profileCard}`}>
        <div className={styles.avatarSection}>
          {session.user.image ? (
            <Image 
              src={session.user.image} 
              alt={session.user.name || 'User'} 
              width={100} 
              height={100} 
              className={styles.avatar} 
            />
          ) : (
            <div className={styles.avatarPlaceholder}>
              <UserIcon size={40} />
            </div>
          )}
          
          <div className={styles.userInfo}>
            <h2>{session.user.name}</h2>
            <div className={styles.emailBadge}>
              <Mail size={14} />
              {session.user.email}
            </div>
          </div>
        </div>

        <div className={styles.actions}>
          <form
            action={async () => {
              'use server';
              await signOut({ redirectTo: '/' });
            }}
          >
            <button type="submit" className={styles.signOutButton}>
              <LogOut size={18} />
              Sign Out
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
