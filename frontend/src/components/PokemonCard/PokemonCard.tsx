import { memo, useState } from 'react';
import type { Pokemon } from '../../types/pokemon';
import styles from './PokemonCard.module.css';

interface PokemonCardProps {
    pokemon: Pokemon;
    onCapture: (id: number) => void;
    onRelease: (id: number) => void;
    isUpdating: boolean;
    onClick: () => void;
}

const TypeBadge = ({ type }: { type: string }) => {
    if (!type) return null;
    const typeClass = type.toLowerCase();
    return (
        <span className={`${styles.typeBadge} ${styles[typeClass]}`}>
            {type}
        </span>
    );
};

export const PokemonCard = memo(({ pokemon, onCapture, onRelease, isUpdating, onClick }: PokemonCardProps) => {
    const formattedNumber = pokemon.number.toString().padStart(4, '0');
    const [imgSrc, setImgSrc] = useState<string | undefined>(undefined);

    const handleImageError = () => {
        if (imgSrc !== '/not-found.png') {
            setImgSrc('/not-found.png');
        }
    };

    return (
        <div className={styles.card} onClick={onClick}>
            <div className={styles.imageSection}>
                <div className={styles.pokeballBack}></div>
                <img
                    src={imgSrc || pokemon.imageUrl}
                    alt={pokemon.name}
                    loading="lazy"
                    onError={handleImageError}
                    className={styles.pokemonImage}
                />
                {pokemon.captured && <div className={styles.capturedTag}>⭐</div>}
            </div>

            <div className={styles.infoSection}>
                <div className={styles.infoTab}></div>
                <div className={styles.pokemonNumber}>{formattedNumber}</div>
                <h3 className={styles.pokemonName}>
                    {pokemon.name}
                </h3>

                <div className={styles.typesContainer}>
                    <TypeBadge type={pokemon.type_one} />
                    <TypeBadge type={pokemon.type_two} />
                </div>

                <div className={styles.actionArea}>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            pokemon.captured ? onRelease(pokemon.id) : onCapture(pokemon.id);
                        }}
                        disabled={isUpdating}
                        className={`${styles.actionButton} ${pokemon.captured ? styles.release : styles.capture}`}
                    >
                        {isUpdating ? '...' : (pokemon.captured ? 'RELEASE' : 'CAPTURE')}
                    </button>
                </div>
            </div>
        </div>
    );
});
