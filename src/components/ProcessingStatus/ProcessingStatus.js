'use client';
import { useEffect, useRef, useState } from 'react';
import { Loader, CheckCircle2, XCircle, Terminal } from 'lucide-react';
import { pollJobStatus } from '@/lib/api';
import styles from './ProcessingStatus.module.css';

export default function ProcessingStatus({ jobId, onComplete }) {
    const [status, setStatus] = useState(null);
    const [logs, setLogs] = useState([]);
    const cancelRef = useRef(null);
    const logRef = useRef(null);

    useEffect(() => {
        if (!jobId) return;

        cancelRef.current = pollJobStatus(jobId, (data) => {
            setStatus(data);

            // Build professional log messages from status
            if (data.message && !logs.includes(data.message)) {
                setLogs((prev) => [...prev, data.message]);
            }

            if (data.status === 'completed' || data.status === 'failed') {
                if (onComplete) onComplete(data);
            }
        });

        return () => {
            if (cancelRef.current) cancelRef.current();
        };
    }, [jobId, onComplete]);

    useEffect(() => {
        if (logRef.current) {
            logRef.current.scrollTop = logRef.current.scrollHeight;
        }
    }, [logs]);

    if (!status) return null;

    const isProcessing = status.status === 'processing';
    const isFailed = status.status === 'failed';
    const isCompleted = status.status === 'completed';

    return (
        <div className={`${styles.wrapper} ${isFailed ? styles.failed : ''} ${isCompleted ? styles.completed : ''}`}>
            <div className={styles.header}>
                <div className={styles.statusRow}>
                    {isProcessing && <Loader size={18} className={styles.spinner} />}
                    {isCompleted && <CheckCircle2 size={20} className={styles.checkIcon} />}
                    {isFailed && <XCircle size={20} className={styles.errorIconSvg} />}
                    <span className={styles.statusLabel}>
                        {isProcessing ? 'Processando...' : isCompleted ? 'Concluído' : 'Falhou'}
                    </span>
                </div>

                {status.progress && status.progress.total > 0 && (
                    <span className={`${styles.progressPct} tabular-nums`}>
                        {status.progress.percentage}%
                    </span>
                )}
            </div>

            {/* Progress bar */}
            {isProcessing && status.progress && (
                <div className={styles.progressTrack}>
                    <div
                        className={styles.progressFill}
                        style={{ width: `${status.progress.percentage}%` }}
                    />
                </div>
            )}

            {/* Professional log area */}
            {logs.length > 0 && (
                <div className={styles.logArea}>
                    <div className={styles.logHeader}>
                        <Terminal size={14} strokeWidth={1.8} className={styles.logIcon} />
                        <span className={styles.logTitle}>Log de processamento</span>
                    </div>
                    <div className={styles.logContent} ref={logRef}>
                        {logs.map((log, i) => (
                            <div key={i} className={styles.logLine}>
                                <span className={styles.logTimestamp}>{String(i + 1).padStart(2, '0')}</span>
                                <span className={styles.logText}>{log}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Errors */}
            {status.errors && status.errors.length > 0 && (
                <div className={styles.errorLog}>
                    <span className={styles.errorLogTitle}>Erros ({status.errors.length})</span>
                    {status.errors.slice(0, 5).map((err, i) => (
                        <span key={i} className={styles.errorItem}>{err}</span>
                    ))}
                </div>
            )}
        </div>
    );
}
