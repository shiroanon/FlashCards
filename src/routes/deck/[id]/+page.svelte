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
		class="absolute top-8 left-8 flex items-center gap-2 text-sm font-bold tracking-widest text-sky-300 uppercase transition-colors hover:text-sky-100"
	>
		← Back to Decks
	</a>

	<div class="mb-4 text-center">
		<h2 class="mb-1 text-2xl font-bold text-sky-200">{deck.title}</h2>
		<p class="text-sm text-slate-400">{deck.description}</p>
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
			class="rounded-lg border border-sky-500/50 bg-sky-500/10 px-5 py-2 text-sm font-semibold tracking-wider text-sky-200 transition hover:border-sky-400 disabled:cursor-not-allowed disabled:opacity-40"
		>
			Previous
		</button>
		<span class="font-mono text-sm text-sky-300">
			{currentIndex + 1} / {cards.length}
		</span>
		<button
			onclick={nextCard}
			disabled={currentIndex === cards.length - 1}
			class="rounded-lg border border-indigo-500/50 bg-indigo-500/10 px-5 py-2 text-sm font-semibold tracking-wider text-indigo-200 transition hover:border-indigo-400 disabled:cursor-not-allowed disabled:opacity-40"
		>
			Next
		</button>
	</div>
</div>