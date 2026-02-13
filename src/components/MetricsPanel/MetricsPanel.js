import Card from '../Card/Card';
import styles from './MetricsPanel.module.css';

export default function MetricsPanel({ data }) {
    if (!data) return null;

    return (
        <div className={styles.grid}>
            <Card
                label="Total de Titulares"
                value={data.total_holders ?? '—'}
                accent
            />
            <Card
                label="Relatórios Gerados"
                value={data.total_pdfs ?? '—'}
                accent
            />
            <Card
                label="Erros"
                value={data.errors?.length ?? 0}
                sublabel={data.errors?.length > 0 ? 'Verificar log' : 'Nenhum erro'}
            />
            <Card
                label="Status"
                value={data.status === 'completed' ? 'Concluído' : data.status ?? '—'}
            />
        </div>
    );
}
