import { Inbox } from 'lucide-react';
import styles from './EmptyState.module.css';

export default function EmptyState({ title, description }) {
    return (
        <div className={styles.wrapper}>
            <Inbox size={48} strokeWidth={1} className={styles.icon} />
            <h4 className={styles.title}>{title}</h4>
            {description && <p className={styles.desc}>{description}</p>}
        </div>
    );
}
