import React from 'react';
import { TypeFilter } from '../TypeFilter/TypeFilter';
import { SearchInput } from '../SearchInput/SearchInput';
import { SortControls } from '../SortControls/SortControls';
import { PageSizeSelector } from '../PageSizeSelector/PageSizeSelector';
import type { SortOrder } from '../../types/pokemon';
import styles from './FilterBar.module.css';

interface FilterBarProps {
    types: string[];
    selectedType?: string;
    onTypeChange: (type?: string) => void;
    search: string;
    onSearchChange: (search: string) => void;
    sort: SortOrder;
    onSortChange: (sort: SortOrder) => void;
    limit: number;
    onLimitChange: (limit: number) => void;
    onClearAll: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
    types, selectedType, onTypeChange,
    search, onSearchChange,
    sort, onSortChange,
    limit, onLimitChange,
    onClearAll
}) => {
    return (
        <div className={styles.filterBar}>
            <div className={styles.topRow}>
                <SearchInput value={search} onChange={onSearchChange} />
                <TypeFilter types={types} selectedType={selectedType} onChange={onTypeChange} />
            </div>

            <div className={styles.bottomRow}>
                <div className={styles.controls}>
                    <SortControls sort={sort} onChange={onSortChange} />
                    <PageSizeSelector limit={limit} onChange={onLimitChange} />
                </div>

                {(selectedType || search || sort !== 'asc') && (
                    <button onClick={onClearAll} className={styles.resetButton}>
                        RESET SYSTEM
                    </button>
                )}
            </div>
        </div>
    );
};
