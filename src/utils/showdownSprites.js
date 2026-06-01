const SHOWDOWN_SPRITE_BASE = 'https://play.pokemonshowdown.com/sprites';

const NAME_OVERRIDES = {
    'nidoran-f': 'nidoranf',
    'nidoran-m': 'nidoranm',
    'mr-mime': 'mrmime',
    'mr-rime': 'mrrime',
    'mime-jr': 'mimejr',
    'type-null': 'typenull',
    'jangmo-o': 'jangmoo',
    'hakamo-o': 'hakamoo',
    'kommo-o': 'kommoo',
    'tapu-koko': 'tapukoko',
    'tapu-lele': 'tapulele',
    'tapu-bulu': 'tapubulu',
    'tapu-fini': 'tapufini',
    'deoxys-normal': 'deoxys',
    'wormadam-plant': 'wormadam',
    'shaymin-land': 'shaymin',
    'giratina-altered': 'giratina',
    'indeedee-male': 'indeedee',
    'toxtricity-amped': 'toxtricity',
    'eiscue-ice': 'eiscue',
    'urshifu-single-strike': 'urshifu',
    'great-tusk': 'greattusk',
    'scream-tail': 'screamtail',
    'brute-bonnet': 'brutebonnet',
    'flutter-mane': 'fluttermane',
    'slither-wing': 'slitherwing',
    'sandy-shocks': 'sandyshocks',
    'iron-treads': 'irontreads',
    'iron-bundle': 'ironbundle',
    'iron-hands': 'ironhands',
    'iron-jugulis': 'ironjugulis',
    'iron-moth': 'ironmoth',
    'iron-thorns': 'ironthorns',
    'wo-chien': 'wochien',
    'chien-pao': 'chienpao',
    'ting-lu': 'tinglu',
    'chi-yu': 'chiyu',
    'roaring-moon': 'roaringmoon',
    'iron-valiant': 'ironvaliant',
    'walking-wake': 'walkingwake',
    'iron-leaves': 'ironleaves',
    'gouging-fire': 'gougingfire',
    'raging-bolt': 'ragingbolt',
    'iron-boulder': 'ironboulder',
    'iron-crown': 'ironcrown',
};

const SHOWDOWN_SPRITE_EXCLUSIONS = new Set([
    'morpeko-full-belly',
]);

export function getShowdownSpriteName(pokemon) {
    const name = pokemon?.name || '';

    return NAME_OVERRIDES[name] || name.replace(/[^a-z0-9-]/g, '');
}

export function getShowdownSpriteUrls(pokemon, options = {}) {
    if (SHOWDOWN_SPRITE_EXCLUSIONS.has(pokemon?.name)) return [];

    const spriteName = getShowdownSpriteName(pokemon);
    const shinySuffix = options.shiny ? '-shiny' : '';

    if (!spriteName) return [];

    return [
        `${SHOWDOWN_SPRITE_BASE}/ani${shinySuffix}/${spriteName}.gif`,
        `${SHOWDOWN_SPRITE_BASE}/gen5ani${shinySuffix}/${spriteName}.gif`,
        `${SHOWDOWN_SPRITE_BASE}/gen5${shinySuffix}/${spriteName}.png`,
        `${SHOWDOWN_SPRITE_BASE}/dex/${spriteName}.png`,
    ];
}

export function getFallbackSpriteUrl(pokemon, options = {}) {
    if (options.shiny && pokemon?.sprites?.front_shiny) return pokemon.sprites.front_shiny;

    return pokemon?.sprites?.front_default
        || pokemon?.sprites?.other?.['official-artwork']?.front_default
        || '';
}

export function getPokemonSpriteUrls(pokemon, options = {}) {
    return [...getShowdownSpriteUrls(pokemon, options), getFallbackSpriteUrl(pokemon, options)].filter(Boolean);
}
