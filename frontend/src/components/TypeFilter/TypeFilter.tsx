import React from 'react';
import styles from './TypeFilter.module.css';

interface TypeFilterProps {
    types: string[];
    selectedType?: string;
    onChange: (type?: string) => void;
}

export const TypeFilter: React.FC<TypeFilterProps> = ({ types, selectedType, onChange }) => {
    return (
        <div className={styles.container}>
            <select
                value={selectedType || ''}
                onChange={(e) => onChange(e.target.value || undefined)}
                aria-label="Filter by type"
                className={styles.select}
            >
                <option value="">ALL TYPES</option>
                {types.map(t => (
                    <option key={t} value={t}>{t.toUpperCase()}</option>
                ))}
            </select>
            <div className={styles.arrow}>▼</div>
        </div>
    );
};
