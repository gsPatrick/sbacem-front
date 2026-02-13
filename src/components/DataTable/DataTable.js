import styles from './DataTable.module.css';

export default function DataTable({ columns = [], rows = [] }) {
    if (!rows.length) return null;

    return (
        <div className={styles.wrapper}>
            <div className={styles.tableWrap}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            {columns.map((col) => (
                                <th
                                    key={col.key}
                                    className={`${styles.th} ${col.align === 'right' ? styles.right : ''}`}
                                >
                                    {col.label}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row, ri) => (
                            <tr key={ri} className={styles.tr}>
                                {columns.map((col) => (
                                    <td
                                        key={col.key}
                                        className={`${styles.td} ${col.align === 'right' ? styles.right : ''} ${col.mono ? 'tabular-nums' : ''}`}
                                    >
                                        {col.render ? col.render(row[col.key], row) : row[col.key]}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
