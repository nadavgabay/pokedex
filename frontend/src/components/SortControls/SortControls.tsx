import React from 'react';
import type { SortOrder } from '../../types/pokemon';
import styles from './SortControls.module.css';

interface SortControlsProps {
    sort: SortOrder;
    onChange: (sort: SortOrder) => void;
}

export const SortControls: React.FC<SortControlsProps> = ({ sort, onChange }) => {
    return (
        <button
            onClick={() => onChange(sort === 'asc' ? 'desc' : 'asc')}
            className={styles.button}
            title={`Sort by number ${sort === 'asc' ? 'descending' : 'ascending'}`}
        >
            <span>NUM.</span>
            <span className={styles.arrow}>{sort === 'asc' ? '▲' : '▼'}</span>
        </button>
    );
};
