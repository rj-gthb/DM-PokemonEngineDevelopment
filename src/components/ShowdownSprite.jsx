import { useMemo, useState } from 'react';
import { getPokemonSpriteUrls } from '../utils/showdownSprites';

export default function ShowdownSprite({ pokemon, className, shiny = false }) {
    const spriteUrls = useMemo(() => (
        Object.hasOwn(pokemon, 'preloadedSpriteUrl') && !shiny
            ? [pokemon.preloadedSpriteUrl].filter(Boolean)
            : getPokemonSpriteUrls(pokemon, { shiny })
    ), [pokemon, shiny]);
    const [spriteState, setSpriteState] = useState({ pokemonName: pokemon.name, shiny, index: 0 });

    const spriteIndex = spriteState.pokemonName === pokemon.name && spriteState.shiny === shiny ? spriteState.index : 0;
    const spriteUrl = spriteUrls[spriteIndex] || '';

    return (
        <img
            className={className}
            src={spriteUrl}
            alt={pokemon.name}
            onError={() => {
                setSpriteState((currentState) => {
                    const currentIndex = currentState.pokemonName === pokemon.name && currentState.shiny === shiny ? currentState.index : 0;
                    const nextIndex = currentIndex + 1;

                    return {
                        pokemonName: pokemon.name,
                        shiny,
                        index: nextIndex < spriteUrls.length ? nextIndex : currentIndex,
                    };
                });
            }}
        />
    );
}
