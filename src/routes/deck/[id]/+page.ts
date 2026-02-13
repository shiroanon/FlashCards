import { error } from '@sveltejs/kit';
import decks from '$lib/data/decks.json';

export function load({ params }) {
    const deck = decks.find((d) => d.id === params.id);

    if (!deck) {
        throw error(404, 'Deck not found');
    }

    return {
        deck
    };
}

export function entries() {
    return decks.map((deck) => ({ id: deck.id }));
}
