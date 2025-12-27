import { useState, useEffect } from 'react';
import { getPokemon, capturePokemon, releasePokemon } from '../services/api';
import type { Pokemon, PokemonResponse } from '../types/pokemon';
import type { GetPokemonParams } from '../services/api';

export const usePokemon = (params: GetPokemonParams) => {
    const [pokemon, setPokemon] = useState<Pokemon[]>([]);
    const [metadata, setMetadata] = useState<PokemonResponse['pagination'] | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [updatingId, setUpdatingId] = useState<number | null>(null);
    const [maxPage, setMaxPage] = useState<number | null>(null);

    useEffect(() => {
        setMaxPage(null);
    }, [params.limit, params.sort, params.type, params.search]);

    useEffect(() => {
        let ignore = false;

        const fetchData = async () => {
            if (params.page !== undefined && params.page < 1) {
                setError("Page number must be at least 1.");
                setPokemon([]);
                setLoading(false);
                return;
            }

            if (maxPage && params.page && params.page > maxPage) {
                setError("Page number exceeds available data.");
                setPokemon([]);
                setLoading(false);
                return;
            }

            setLoading(true);
            setError(null);
            try {
                const currentPage = params.page || 1;
                if (pokemon.length === 0 && currentPage > 1) {
                    const promises = [];
                    for (let i = 1; i <= currentPage; i++) {
                        promises.push(getPokemon({ ...params, page: i }));
                    }
                    const results = await Promise.all(promises);

                    if (!ignore) {
                        const allData: Pokemon[] = [];
                        let lastMeta = null;
                        let hasError = false;

                        for (const res of results) {
                            if (res.success) {
                                allData.push(...res.data);
                                lastMeta = res.pagination;
                            } else {
                                setError(res.error || "Failed to restore session");
                                if (res.maxPage) setMaxPage(res.maxPage);
                                hasError = true;
                                break;
                            }
                        }

                        if (!hasError) {
                            const uniqueData = Array.from(new Map(allData.map(p => [p.id, p])).values());
                            setPokemon(uniqueData);
                            if (lastMeta) {
                                setMetadata(lastMeta)
                            };
                        }
                    }
                } else {
                    const result = await getPokemon(params);
                    if (!ignore) {
                        if (result.success) {
                            setPokemon(prev => {
                                if (params.page === 1) return result.data;
                                const newIds = new Set(result.data.map(p => p.id));
                                const filteredPrev = prev.filter(p => !newIds.has(p.id));
                                return [...filteredPrev, ...result.data];
                            });
                            setMetadata(result.pagination);
                            setMaxPage(result.pagination.totalPages);
                        } else {
                            setError(result.error || "Failed to fetch data");
                            if (result.maxPage) setMaxPage(result.maxPage);
                            if (params.page === 1) setPokemon([]);
                        }
                    }
                }
            } catch (err: any) {
                if (!ignore) {
                    setError(err.message || "An error occurred");
                    if (pokemon.length === 0) setPokemon([]);
                }
            } finally {
                if (!ignore) setLoading(false);
            }
        };

        fetchData();

        return () => {
            ignore = true;
        };
    }, [params.page, params.limit, params.sort, params.type, params.search]);

    const handleCapture = async (id: number) => {
        setUpdatingId(id);
        try {
            const res = await capturePokemon(id);
            if (res.success) {
                setPokemon(prev => prev.map(p =>
                    p.id === id ? { ...p, captured: true } : p
                ));
                setMetadata(prev => prev ? { ...prev, capturedCount: prev.capturedCount + 1 } : null);
            }
        } catch (err) {
            console.error("Capture failed", err);
        } finally {
            setUpdatingId(null);
        }
    };

    const handleRelease = async (id: number) => {
        setUpdatingId(id);
        try {
            const res = await releasePokemon(id);
            if (res.success) {
                setPokemon(prev => prev.map(p =>
                    p.id === id ? { ...p, captured: false } : p
                ));
                setMetadata(prev => prev ? { ...prev, capturedCount: prev.capturedCount > 0 ? prev.capturedCount - 1 : 0 } : null);
            }
        } catch (err) {
            console.error("Release failed", err);
        } finally {
            setUpdatingId(null);
        }
    };

    return {
        pokemon,
        metadata,
        loading,
        error,
        capture: handleCapture,
        release: handleRelease,
        updatingId,
        maxPage
    };
};
