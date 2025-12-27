import React from 'react';
import styles from './PageSizeSelector.module.css';

interface PageSizeSelectorProps {
    limit: number;
    onChange: (limit: number) => void;
}

export const PageSizeSelector: React.FC<PageSizeSelectorProps> = ({ limit, onChange }) => {
    return (
        <div className={styles.container}>
            <span className={styles.label}>SHOW:</span>
            <select
                value={limit}
                onChange={(e) => onChange(Number(e.target.value))}
                className={styles.select}
            >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
            </select>
        </div>
    );
};
