import React from 'react';
import { ThemeToggle } from '../ThemeToggle/ThemeToggle';
import styles from './Header.module.css';

interface HeaderProps {
    capturedCount?: number;
}

export const Header: React.FC<HeaderProps> = ({ capturedCount = 0 }) => {
    return (
        <header className={styles.header}>
            <div className={styles.leftSection}>
                <div className={styles.cameraLens}>
                    <div className={styles.lensReflection}></div>
                </div>
                <div className={styles.titleSection}>
                    <h1 className={styles.title}>POKÉDEX</h1>
                    <div className={styles.subtitle}>
                        <span className={styles.generation}>
                            GENERATION I-IV
                        </span>
                        <span className={styles.divider}>|</span>
                        <span className={styles.captureCount}>
                            CAUGHT: {capturedCount}
                        </span>
                    </div>
                </div>
            </div>

            <div className={styles.rightSection}>
                <div className={styles.statusLights}>
                    <div className={`${styles.statusLight} ${styles.red}`}></div>
                    <div className={`${styles.statusLight} ${styles.yellow}`}></div>
                    <div className={`${styles.statusLight} ${styles.green}`}></div>
                </div>
                <div className={styles.separator}></div>
                <ThemeToggle />
            </div>
        </header>
    );
};
