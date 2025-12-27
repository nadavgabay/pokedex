import React, { useRef, useState, useCallback, useEffect } from 'react';
import type { Pokemon } from '../../types/pokemon';
import styles from './PokemonModal.module.css';

interface PokemonModalProps {
    pokemon: Pokemon;
    onClose: () => void;
}

export const PokemonModal: React.FC<PokemonModalProps> = ({ pokemon, onClose }) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const [style, setStyle] = useState<React.CSSProperties>({});
    const [opacity, setOpacity] = useState(0);

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);

    const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;

        const rect = cardRef.current.getBoundingClientRect();
        const absolute = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        };
        const center = {
            x: rect.width / 2,
            y: rect.height / 2,
        };
        const delta = {
            x: absolute.x - center.x,
            y: absolute.y - center.y,
        };

        const rotate = {
            x: (delta.y / center.y) * -15,
            y: (delta.x / center.x) * 15,
        };

        const percent = {
            x: (absolute.x / rect.width) * 100,
            y: (absolute.y / rect.height) * 100,
        };

        setStyle({
            '--rotate-x': `${rotate.x}deg`,
            '--rotate-y': `${rotate.y}deg`,
            '--pointer-x': `${percent.x}%`,
            '--pointer-y': `${percent.y}%`,
            '--bg-x': `${50 + (percent.x - 50) / 4}%`,
            '--bg-y': `${50 + (percent.y - 50) / 4}%`,
            transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
        } as React.CSSProperties);

        setOpacity(1);
    }, []);

    const handleMouseLeave = useCallback(() => {
        setOpacity(0);
        setTimeout(() => {
            setStyle(prev => ({ ...prev, transition: 'transform 0.5s ease-out', transform: 'none' }));
        }, 100);
    }, []);

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div className={styles.overlay} onClick={handleBackdropClick}>
            <div className={styles.modalContent}>
                <button className={styles.closeButton} onClick={onClose}>&times;</button>

                <div
                    className={styles.cardRotator}
                    ref={cardRef}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                    style={style}
                >
                    <div className={styles.glare} style={{ '--opacity': opacity } as React.CSSProperties}></div>
                    <div className={styles.shine} style={{ '--opacity': opacity } as React.CSSProperties}></div>

                    <div className={styles.cardFront}>
                        <div className={styles.imageSection}>
                            <img
                                src={pokemon.imageUrl}
                                alt={pokemon.name}
                                className={styles.pokemonImage}
                            />
                        </div>

                        <div className={styles.infoSection}>
                            <div className={styles.header}>
                                <div className={styles.number}>NO. {pokemon.number.toString().padStart(4, '0')}</div>
                                <div className={styles.generation}>GEN {pokemon.generation || 1}</div>
                            </div>

                            <h2 className={styles.name}>{pokemon.name}</h2>

                            <div className={styles.types}>
                                {pokemon.type_one && (
                                    <span className={styles.generation} style={{
                                        borderColor: `var(--type-${pokemon.type_one.toLowerCase()})`,
                                        color: `var(--type-${pokemon.type_one.toLowerCase()})`
                                    }}>
                                        {pokemon.type_one}
                                    </span>
                                )}
                                {pokemon.type_two && (
                                    <span className={styles.generation} style={{
                                        borderColor: `var(--type-${pokemon.type_two.toLowerCase()})`,
                                        color: `var(--type-${pokemon.type_two.toLowerCase()})`
                                    }}>
                                        {pokemon.type_two}
                                    </span>
                                )}
                            </div>

                            <div className={styles.statsGrid}>
                                <div className={styles.statItem}>
                                    <span className={styles.statLabel}>HP</span>
                                    <span className={styles.statValue}>{pokemon.hit_points}</span>
                                </div>
                                <div className={styles.statItem}>
                                    <span className={styles.statLabel}>ATTACK</span>
                                    <span className={styles.statValue}>{pokemon.attack}</span>
                                </div>
                                <div className={styles.statItem}>
                                    <span className={styles.statLabel}>DEFENSE</span>
                                    <span className={styles.statValue}>{pokemon.defense}</span>
                                </div>
                                <div className={styles.statItem}>
                                    <span className={styles.statLabel}>SP. ATK</span>
                                    <span className={styles.statValue}>{pokemon.special_attack}</span>
                                </div>
                                <div className={styles.statItem}>
                                    <span className={styles.statLabel}>SP. DEF</span>
                                    <span className={styles.statValue}>{pokemon.special_defense}</span>
                                </div>
                                <div className={styles.statItem}>
                                    <span className={styles.statLabel}>SPEED</span>
                                    <span className={styles.statValue}>{pokemon.speed}</span>
                                </div>
                            </div>

                            {pokemon.legendary && (
                                <div style={{ textAlign: 'center' }}>
                                    <span className={styles.legendaryBadge}>LEGENDARY</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
