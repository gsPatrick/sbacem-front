'use client';
import { useState, useCallback, useRef } from 'react';
import { UploadCloud, FileArchive } from 'lucide-react';
import styles from './UploadZone.module.css';

export default function UploadZone({ onUpload, disabled = false }) {
    const [dragging, setDragging] = useState(false);
    const [file, setFile] = useState(null);
    const [progress, setProgress] = useState(0);
    const [uploading, setUploading] = useState(false);
    const inputRef = useRef(null);

    const handleDragOver = useCallback((e) => {
        e.preventDefault();
        if (!disabled) setDragging(true);
    }, [disabled]);

    const handleDragLeave = useCallback(() => {
        setDragging(false);
    }, []);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        setDragging(false);
        if (disabled) return;
        const dropped = e.dataTransfer.files[0];
        if (dropped && dropped.name.endsWith('.zip')) {
            setFile(dropped);
        }
    }, [disabled]);

    const handleSelect = useCallback((e) => {
        const selected = e.target.files[0];
        if (selected) setFile(selected);
    }, []);

    const handleUpload = useCallback(async () => {
        if (!file || !onUpload) return;
        setUploading(true);
        setProgress(0);
        try {
            await onUpload(file, (pct) => setProgress(pct));
        } finally {
            setUploading(false);
        }
    }, [file, onUpload]);

    const formatSize = (bytes) => {
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    return (
        <div className={styles.wrapper}>
            <div
                className={`${styles.dropzone} ${dragging ? styles.active : ''} ${disabled ? styles.disabled : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => !disabled && inputRef.current?.click()}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && !disabled && inputRef.current?.click()}
            >
                <input
                    ref={inputRef}
                    type="file"
                    accept=".zip"
                    onChange={handleSelect}
                    className={styles.input}
                    disabled={disabled}
                    aria-label="Selecione um arquivo ZIP"
                />
                <UploadCloud size={40} strokeWidth={1.2} className={styles.icon} />
                <div className={styles.text}>
                    <span className={styles.primary}>
                        {dragging ? 'Solte o arquivo aqui' : 'Arraste o arquivo ZIP ou clique para selecionar'}
                    </span>
                    <span className={styles.secondary}>Aceita arquivos .zip com planilhas de distribuiço</span>
                </div>
            </div>

            {file && (
                <div className={styles.fileInfo}>
                    <div className={styles.fileName}>
                        <FileArchive size={22} strokeWidth={1.5} className={styles.fileIcon} />
                        <div className={styles.fileMeta}>
                            <span className={styles.fileNameText}>{file.name}</span>
                            <span className={styles.fileSize}>{formatSize(file.size)}</span>
                        </div>
                    </div>

                    {uploading ? (
                        <div className={styles.progressWrap}>
                            <div className={styles.progressTrack}>
                                <div className={styles.progressFill} style={{ width: `${progress}%` }} />
                            </div>
                            <span className={styles.progressLabel}>{progress}%</span>
                        </div>
                    ) : (
                        <button className={styles.uploadBtn} onClick={handleUpload} disabled={disabled}>
                            Processar
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
