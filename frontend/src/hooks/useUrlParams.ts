import { useSearchParams } from 'react-router-dom';
import { useMemo } from 'react';
import type { SortOrder } from '../types/pokemon';

export function useUrlParams() {
    const [searchParams, setSearchParams] = useSearchParams();

    const params = useMemo(() => ({
        page: Number(searchParams.get('page')) || 1,
        limit: Number(searchParams.get('limit')) || 10,
        sort: (searchParams.get('sort') as SortOrder) || 'asc',
        type: searchParams.get('type') || undefined,
        search: searchParams.get('search') || '',
    }), [searchParams]);

    const updateParams = (newParams: Partial<typeof params>) => {
        const nextParams = new URLSearchParams(searchParams);

        Object.entries(newParams).forEach(([key, value]) => {
            if (value === null || value === '' || value === undefined) {
                nextParams.delete(key);
            } else {
                nextParams.set(key, String(value));
            }
        });

        const isPageSet = 'page' in newParams;
        if (!isPageSet && ('type' in newParams || 'search' in newParams || 'limit' in newParams)) {
            nextParams.set('page', '1');
        }

        setSearchParams(nextParams);
    };

    return { params, updateParams };
}
