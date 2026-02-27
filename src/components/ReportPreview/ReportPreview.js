import { FileDown, FileSpreadsheet } from 'lucide-react';
import { getConsolidatedUrl, getPdfsUrl } from '@/lib/api';
import styles from './ReportPreview.module.css';

export default function ReportPreview({ jobId, status }) {
    if (!jobId || status !== 'completed') return null;

    return (
        <div className={styles.wrapper}>
            <h3 className={styles.title}>Relatórios Prontos</h3>
            <p className={styles.desc}>Seus arquivos estão prontos para download.</p>

            <div className={styles.actions}>
                <a href={getPdfsUrl(jobId)} className={styles.primaryBtn} download>
                    <FileDown size={18} strokeWidth={1.8} />
                    Baixar Todos os Relatórios (ZIP)
                </a>
                <a href={getConsolidatedUrl(jobId)} className={styles.secondaryBtn} download>
                    <FileSpreadsheet size={18} strokeWidth={1.8} />
                    Baixar Planilha Consolidada
                </a>
            </div>
        </div>
    );
}
