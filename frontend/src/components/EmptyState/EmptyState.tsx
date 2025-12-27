import React from 'react';
import styles from './EmptyState.module.css';

interface EmptyStateProps {
    message?: string;
    onClearFilters?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ message = "No Pokemon found", onClearFilters }) => {
    return (
        <div className={styles.container}>
            <p className={styles.message}>{message}</p>
            {onClearFilters && (
                <button onClick={onClearFilters} className={styles.button}>
                    Clear all filters
                </button>
            )}
        </div>
    );
};
