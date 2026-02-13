'use client';
import { useState } from 'react';
import Header from '../Header/Header';
import Sidebar from '../Sidebar/Sidebar';
import styles from './DashboardLayout.module.css';

export default function DashboardLayout({ children, title }) {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <div className={styles.wrapper}>
            <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
            <div className={`${styles.main} ${collapsed ? styles.collapsed : ''}`}>
                <Header title={title} />
                <main className={styles.content}>
                    <div className={styles.container}>
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
