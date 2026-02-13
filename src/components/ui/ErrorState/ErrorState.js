import { AlertTriangle } from 'lucide-react';
import styles from './ErrorState.module.css';

export default function ErrorState({ title = 'Erro no processamento', message, onRetry }) {
    return (
        <div className={styles.wrapper}>
            <AlertTriangle size={40} strokeWidth={1.3} className={styles.icon} />
            <h4 className={styles.title}>{title}</h4>
            {message && <p className={styles.message}>{message}</p>}
            {onRetry && (
                <button className={styles.retryBtn} onClick={onRetry}>
                    Tentar novamente
                </button>
            )}
        </div>
    );
}
