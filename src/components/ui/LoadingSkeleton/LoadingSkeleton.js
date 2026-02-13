import styles from './LoadingSkeleton.module.css';

export default function LoadingSkeleton({ lines = 3, height = 20 }) {
    return (
        <div className={styles.wrapper}>
            {Array.from({ length: lines }).map((_, i) => (
                <div
                    key={i}
                    className={styles.line}
                    style={{ height, width: `${85 - i * 15}%` }}
                />
            ))}
        </div>
    );
}
