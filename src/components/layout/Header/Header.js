import { Activity } from 'lucide-react';
import styles from './Header.module.css';

export default function Header({ title = 'Distribution Pro' }) {
    return (
        <header className={styles.header}>
            <div className={styles.left}>
                <h2 className={styles.pageTitle}>{title}</h2>
            </div>
            <div className={styles.right}>
                <div className={styles.status}>
                    <Activity size={12} className={styles.statusIcon} />
                    <span className={styles.statusText}>Sistema operacional</span>
                </div>
                <div className={styles.avatar}>
                    <span>SA</span>
                </div>
            </div>
        </header>
    );
}
