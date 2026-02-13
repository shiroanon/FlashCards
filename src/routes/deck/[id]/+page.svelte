<script lang="ts">
	import Flashcard from '$lib/components/Flashcard.svelte';
	import { page } from '$app/state';
	import { base } from '$app/paths';

	import { onMount } from 'svelte';
	import { gsap } from 'gsap';

	let { data } = $props();
	let deck = $derived(data.deck);
	let cards = $derived(deck.cards);

	let currentIndex = $state(0);
	let isFlipped = $state(false);
	let cardContainer: HTMLElement;
	let isAnimating = false;

	function animateSlide(direction: 'next' | 'prev', callback: () => void) {
		if (isAnimating) return;
		isAnimating = true;

		const outX = direction === 'next' ? -100 : 100;
		const inX = direction === 'next' ? 100 : -100;

		const tl = gsap.timeline({
			onComplete: () => {
				isAnimating = false;
			}
		});

		// Slide out
		tl.to(cardContainer, {
			xPercent: outX,
			opacity: 0,
			duration: 0.3,
			ease: 'power2.in',
			onComplete: () => {
				callback();
				// Reset position for slide in
				gsap.set(cardContainer, { xPercent: inX, opacity: 0 });
			}
		});

		// Slide in
		tl.to(cardContainer, {
			xPercent: 0,
			opacity: 1,
			duration: 0.4,
			ease: 'power2.out' // slightly longer easing for smooth entry
		});
	}

	function nextCard() {
		if (currentIndex < cards.length - 1 && !isAnimating) {
			animateSlide('next', () => {
				isFlipped = false;
				currentIndex++;
			});
		}
	}

	function prevCard() {
		if (currentIndex > 0 && !isAnimating) {
			animateSlide('prev', () => {
				isFlipped = false;
				currentIndex--;
			});
		}
	}

	function toggleFlip() {
		isFlipped = !isFlipped;
	}
</script>

<div class="relative flex min-h-screen flex-col items-center justify-center gap-8 p-4">
	<a
		href="{base}/"
		class="absolute top-8 left-8 flex items-center gap-2 text-sm font-bold tracking-widest text-red-500 uppercase transition-colors hover:text-white"
	>
		← Back to Decks
	</a>

	<div class="mb-4 text-center">
		<h2 class="mb-1 text-2xl font-bold text-red-500">{deck.title}</h2>
		<p class="text-sm text-gray-500">{deck.description}</p>
	</div>

	<div class="w-full max-w-md" bind:this={cardContainer}>
		<Flashcard
			front={cards[currentIndex].front}
			back={cards[currentIndex].back}
			flipped={isFlipped}
			onclick={toggleFlip}
		/>
	</div>

	<div class="flex items-center gap-4">
		<button
			onclick={prevCard}
			disabled={currentIndex === 0}
			class="rounded-lg border-2 border-red-500 px-6 py-2 font-bold tracking-wider text-red-500 uppercase shadow-[0_0_10px_rgba(255,0,0,0.3)] transition-colors hover:bg-red-500 hover:text-black disabled:cursor-not-allowed disabled:opacity-50"
		>
			Previous
		</button>
		<span class="mx-4 font-mono text-lg text-red-500">
			{currentIndex + 1} / {cards.length}
		</span>
		<button
			onclick={nextCard}
			disabled={currentIndex === cards.length - 1}
			class="rounded-lg border-2 border-red-500 px-6 py-2 font-bold tracking-wider text-red-500 uppercase shadow-[0_0_10px_rgba(255,0,0,0.3)] transition-colors hover:bg-red-500 hover:text-black disabled:cursor-not-allowed disabled:opacity-50"
		>
			Next
		</button>
	</div>
</div>
