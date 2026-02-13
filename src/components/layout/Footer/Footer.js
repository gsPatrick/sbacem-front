import styles from './Footer.module.css';

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <span className={styles.text}>
                © {new Date().getFullYear()} SBACEM — Sociedade Brasileira de Administração e Proteção de Direitos Intelectuais
            </span>
            <span className={styles.link}>sbacem.org.br</span>
        </footer>
    );
}
