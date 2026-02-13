<script lang="ts">
	import DeckCard from '$lib/components/DeckCard.svelte';
	import decks from '$lib/data/decks.json';
	import { onMount } from 'svelte';
	import { gsap } from 'gsap';

	let deckContainer: HTMLElement;

	onMount(() => {
		const cards = deckContainer.children;
		gsap.fromTo(
			cards,
			{ opacity: 0, y: 50 },
			{ opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out' }
		);

		gsap.fromTo(
			'h1',
			{ opacity: 0, scale: 0.9 },
			{ opacity: 1, scale: 1, duration: 1, ease: 'elastic.out(1, 0.5)' }
		);
		gsap.fromTo('p', { opacity: 0 }, { opacity: 1, duration: 1, delay: 0.3 });
	});
</script>

<div class="min-h-screen p-8">
	<header class="mb-12 text-center">
		<h1
			class="mb-4 bg-gradient-to-r from-red-500 to-pink-600 bg-clip-text text-4xl font-bold tracking-tighter text-transparent uppercase"
		>
			Flashcards For Me
		</h1>
		<p class="text-gray-400">Select a deck to start learning</p>
	</header>

	<div
		bind:this={deckContainer}
		class="mx-auto grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
	>
		{#each decks as deck}
			<DeckCard
				id={deck.id}
				title={deck.title}
				description={deck.description}
				cardCount={deck.cards.length}
			/>
		{/each}
	</div>
</div>
