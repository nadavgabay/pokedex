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

const normalizePokemonName = (name: string) => {
    name = name.replace(/%/g, '').replace(/\s*forme$/i, '');

    name = name.replace(/\s*[A-Z][a-z]*\s*[Ss][Ii][Zz][Ee]$/, '');

    name = name.replace(/([a-z])([A-Z])/g, '$1 $2');

    name = name.replace(/([a-zA-Z])(\d)/g, '$1 $2');

    const megaPattern = /^(.+?)\s*Mega\s+\1(\s+(.+))?$/i;
    const megaMatch = name.match(megaPattern);

    if (megaMatch) {
        const baseName = megaMatch[1];
        const suffix = megaMatch[3];
        name = suffix ? `${baseName}-Mega-${suffix}` : `${baseName}-Mega`;
    } else {
        const words = name.split(/\s+/);
        const seen = new Set<string>();
        const uniqueWords: string[] = [];

        for (const word of words) {
            const lower = word.toLowerCase();
            if (!seen.has(lower) && lower !== '') {
                seen.add(lower);
                uniqueWords.push(word);
            }
        }
        name = uniqueWords.join(' ');
    }

    name = name.toLowerCase().trim();

    const replacements: Record<string, string> = {
        " ": "-",
        ".": "",
        "'": "",
        "♀": "-f",
        "♂": "-m",
        "é": "e",
        "á": "a",
        "í": "i",
        "ó": "o",
        "ú": "u",
    }

    for (const [k, v] of Object.entries(replacements)) {
        name = name.replaceAll(k, v);
    }

    return name;
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
        const nameClean = normalizePokemonName(pokemon.name);
        const artworkUrl = `https://img.pokemondb.net/artwork/large/${nameClean}.jpg`;

        if (imgSrc === artworkUrl || pokemon.imageUrl === artworkUrl) {
            if (imgSrc !== '/not-found.png') {
                setImgSrc('/not-found.png');
            }
        } else {
            setImgSrc(artworkUrl);
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
