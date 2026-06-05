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
	let isAnimating = $state(false);
	let touchStartX = 0;
	let touchStartY = 0;
	let touchMoved = false;

	function animateSlide(direction: 'next' | 'prev', callback: () => void) {
		if (isAnimating || !cardContainer) return;
		isAnimating = true;

		const outX = direction === 'next' ? -80 : 80;
		const inX = direction === 'next' ? 80 : -80;

		const tl = gsap.timeline({
			onComplete: () => {
				isAnimating = false;
			}
		});

		tl.to(cardContainer, {
			x: outX,
			opacity: 0,
			duration: 0.28,
			ease: 'power2.in',
			onComplete: () => {
				callback();
				gsap.set(cardContainer, { x: inX, opacity: 0 });
			}
		});

		tl.to(cardContainer, {
			x: 0,
			opacity: 1,
			duration: 0.35,
			ease: 'power2.out'
		});
	}

	function goNext() {
		if (currentIndex < cards.length - 1 && !isAnimating) {
			animateSlide('next', () => {
				isFlipped = false;
				currentIndex++;
			});
		}
	}

	function goPrev() {
		if (currentIndex > 0 && !isAnimating) {
			animateSlide('prev', () => {
				isFlipped = false;
				currentIndex--;
			});
		}
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'ArrowRight') goNext();
		else if (e.key === 'ArrowLeft') goPrev();
		else if (e.key === ' ' || e.key === 'Spacebar') {
			e.preventDefault();
			isFlipped = !isFlipped;
		}
	}

	onMount(() => {
		window.addEventListener('keydown', handleKeydown);
		gsap.fromTo('.deck-header', { opacity: 0, y: -12 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' });
		gsap.fromTo('.card-wrapper', { opacity: 0, y: 30, scale: 0.97 }, { opacity: 1, y: 0, scale: 1, duration: 0.8, delay: 0.1, ease: 'power3.out' });
		gsap.fromTo('.controls-hint', { opacity: 0 }, { opacity: 1, duration: 0.7, delay: 0.4, ease: 'power2.out' });

		return () => window.removeEventListener('keydown', handleKeydown);
	});
</script>

<div class="relative flex min-h-screen flex-col items-center justify-center gap-6 p-4 bg-background text-on-background">
	<!-- Back link -->
	<a
		href="{base}/"
		class="absolute top-6 left-4 flex items-center gap-2 text-sm font-semibold tracking-wide text-primary transition-colors hover:text-primary-fixed-dim md:left-8"
	>
		<span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 0;">arrow_back</span>
		Back to Decks
	</a>

	<!-- Deck header -->
	<div class="deck-header text-center mt-10 mb-2">
		<h2 class="font-headline-md text-headline-md text-on-background mb-1">{deck.title}</h2>
		{#if deck.description}
			<p class="font-body-md text-body-md text-on-surface-variant">{deck.description}</p>
		{/if}
	</div>

	<!-- Card -->
	<div
		class="card-wrapper w-full max-w-lg select-none"
		bind:this={cardContainer}
		ontouchstart={(e) => {
			touchStartX = e.touches[0].clientX;
			touchStartY = e.touches[0].clientY;
			touchMoved = false;
		}}
		ontouchmove={(e) => {
			const dx = e.touches[0].clientX - touchStartX;
			const dy = e.touches[0].clientY - touchStartY;
			if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 5) touchMoved = true;
		}}
		ontouchend={(e) => {
			if (!touchMoved) return;
			const dx = (e.changedTouches[0]?.clientX ?? touchStartX) - touchStartX;
			if (Math.abs(dx) > 40) {
				if (dx < 0) goNext();
				else goPrev();
			}
			touchMoved = false;
		}}
	>
		<Flashcard
			front={cards[currentIndex].front}
			back={cards[currentIndex].back}
			flipped={isFlipped}
			onclick={() => (isFlipped = !isFlipped)}
		/>
	</div>

	<!-- Counter + keyboard hint -->
	<div class="controls-hint flex items-center gap-4 text-center">
		<span class="font-label-md text-label-md text-secondary tabular-nums">
			{currentIndex + 1} / {cards.length}
		</span>
		<span class="hidden md:inline font-label-md text-label-md text-on-surface-variant/70">
			← → navigate · Space flip
		</span>
	</div>
</div>
