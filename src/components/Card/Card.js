import styles from './Card.module.css';

export default function Card({ label, value, sublabel, accent = false }) {
    return (
        <div className={`${styles.card} ${accent ? styles.accent : ''}`}>
            <span className={styles.label}>{label}</span>
            <span className={`${styles.value} tabular-nums`}>{value}</span>
            {sublabel && <span className={styles.sublabel}>{sublabel}</span>}
        </div>
    );
}
