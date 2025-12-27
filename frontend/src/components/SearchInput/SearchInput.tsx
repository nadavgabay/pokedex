import React, { useEffect, useState } from 'react';
import styles from './SearchInput.module.css';

interface SearchInputProps {
    value: string;
    onChange: (value: string) => void;
}

export const SearchInput: React.FC<SearchInputProps> = ({ value, onChange }) => {
    const [localValue, setLocalValue] = useState(value || '');

    useEffect(() => {
        setLocalValue(value || '');
    }, [value]);

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (localValue !== value) {
                onChange(localValue);
            }
        }, 300);
        return () => clearTimeout(timeout);
    }, [localValue, onChange, value]);

    return (
        <div className={styles.container}>
            <input
                type="text"
                value={localValue}
                onChange={(e) => setLocalValue(e.target.value)}
                placeholder="SEARCH POKEMON..."
                className={styles.input}
            />
        </div>
    );
};
