'use client';
import { useState } from 'react';
import { LayoutDashboard, Upload, FileText, Settings, ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './Sidebar.module.css';

const NAV_ITEMS = [
    { id: 'dashboard', label: 'Dashboard', Icon: LayoutDashboard },
    { id: 'upload', label: 'Upload', Icon: Upload },
    { id: 'reports', label: 'Relatórios', Icon: FileText },
    { id: 'settings', label: 'Configurações', Icon: Settings },
];

export default function Sidebar({ activeItem = 'dashboard', collapsed = false, onToggle }) {
    return (
        <aside className={`${styles.sidebar} ${collapsed ? styles.collapsed : ''}`}>
            {/* Brand */}
            <div className={styles.brand}>
                <div className={styles.brandMark}>
                    <span className={styles.brandIcon}>S</span>
                </div>
                {!collapsed && (
                    <div className={styles.brandText}>
                        <span className={styles.brandName}>SBACEM</span>
                        <span className={styles.brandSub}>Distribution Pro</span>
                    </div>
                )}
            </div>

            {/* Navigation */}
            <nav className={styles.nav}>
                {!collapsed && <div className={styles.navLabel}>MENU</div>}
                {NAV_ITEMS.map((item) => (
                    <button
                        key={item.id}
                        className={`${styles.navItem} ${activeItem === item.id ? styles.active : ''}`}
                        title={item.label}
                    >
                        <item.Icon size={18} strokeWidth={1.8} className={styles.navIcon} />
                        {!collapsed && <span className={styles.navText}>{item.label}</span>}
                        {activeItem === item.id && <span className={styles.activeIndicator} />}
                    </button>
                ))}
            </nav>

            {/* Collapse toggle */}
            <button className={styles.collapseBtn} onClick={onToggle} title={collapsed ? 'Expandir' : 'Recolher'}>
                {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </button>
        </aside>
    );
}
