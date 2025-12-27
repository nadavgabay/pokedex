import React from 'react';
import { PokemonCard } from '../PokemonCard/PokemonCard';
import { LoadingSpinner } from '../LoadingSpinner/LoadingSpinner';
import { EmptyState } from '../EmptyState/EmptyState';
import type { Pokemon } from '../../types/pokemon';
import styles from './PokemonList.module.css';

interface PokemonListProps {
    pokemon: Pokemon[];
    loading: boolean;
    error: string | null;
    maxPage: number | null;
    updatingId: number | null;
    onCapture: (id: number) => void;
    onRelease: (id: number) => void;
    onResetPage?: () => void;
}

import { PokemonModal } from '../PokemonModal/PokemonModal';

export const PokemonList: React.FC<PokemonListProps> = ({
    pokemon, loading, error, maxPage, updatingId, onCapture, onRelease, onResetPage
}) => {
    const [selectedPokemon, setSelectedPokemon] = React.useState<Pokemon | null>(null);

    if (error) {
        const displayError = maxPage
            ? `${error} (Try a page between 1 and ${maxPage})`
            : error;

        return (
            <div className={styles.errorContainer}>
                <img
                    src="/pikachu.gif"
                    alt="Pokemon animation"
                    className={styles.errorAnimation}
                />
                <EmptyState message={` PROF OAK Says: "${displayError}"`} />
                {onResetPage && (
                    <button onClick={onResetPage} className={styles.resetButton}>
                        BACK TO PAGE 1
                    </button>
                )}
            </div>
        );
    }

    if (!loading && pokemon.length === 0) return <EmptyState />;

    return (
        <div className={styles.container}>
            {loading && (
                <div className={styles.loadingOverlay}>
                    <LoadingSpinner />
                    <span>LOADING...</span>
                </div>
            )}

            <div className={styles.grid}>
                {pokemon.map((p) => (
                    <PokemonCard
                        key={p.id}
                        pokemon={p}
                        onCapture={onCapture}
                        onRelease={onRelease}
                        isUpdating={updatingId === p.id}
                        onClick={() => setSelectedPokemon(p)}
                    />
                ))}
            </div>

            {selectedPokemon && (
                <PokemonModal
                    pokemon={selectedPokemon}
                    onClose={() => setSelectedPokemon(null)}
                />
            )}
        </div>
    );
};
