<script lang="ts">
	import { onMount } from 'svelte';
	import { gsap } from 'gsap';
	import decks from '$lib/data/decks.json';
	import { base } from '$app/paths';

	type Deck = (typeof decks)[number] & { progress?: number };
	let deckContainer: HTMLElement;
	let cardEls: HTMLDivElement[] = [];

	const SESSION_KEY = 'flashflow_progress_v1';

	function loadProgress(): Record<string, number> {
		try {
			const raw = sessionStorage.getItem(SESSION_KEY);
			return raw ? JSON.parse(raw) : {};
		} catch {
			return {};
		}
	}

	function saveProgress(deckId: string, value: number) {
		const all = loadProgress();
		all[deckId] = value;
		sessionStorage.setItem(SESSION_KEY, JSON.stringify(all));
	}

	function getProgress(deck: Deck): number {
		const stored = loadProgress()[deck.id];
		return typeof stored === 'number' ? Math.min(100, Math.max(0, stored)) : deck.progress ?? 0;
	}

	function deckIcon(id: string): string {
		const map: Record<string, string> = {
			'intro': 'style',
			'math-101': 'calculate',
			'coding-concepts': 'code',
			'reported-statements': 'record_voice_over',
			'reported-questions': 'help',
			'reported-imperatives-exclamations': 'chat_bubble'
		};
		return map[id] ?? 'description';
	}

	function iconBg(id: string): string {
		if (id === 'math-101') return 'bg-tertiary-fixed-dim/20';
		if (id === 'coding-concepts') return 'bg-secondary-container';
		return 'bg-primary-container/10';
	}

	function iconColor(id: string): string {
		if (id === 'math-101') return 'text-tertiary';
		if (id === 'coding-concepts') return 'text-on-secondary-container';
		return 'text-primary';
	}

	onMount(() => {
		cardEls = Array.from(deckContainer.children) as HTMLDivElement[];

		gsap.fromTo(
			cardEls,
			{ opacity: 0, y: 50, scale: 0.97 },
			{
				opacity: 1,
				y: 0,
				scale: 1,
				duration: 0.75,
				stagger: 0.1,
				ease: 'power3.out',
				clearProps: 'transform'
			}
		);

		gsap.fromTo('.welcome-title', { opacity: 0, y: -16 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' });
		gsap.fromTo('.welcome-sub', { opacity: 0 }, { opacity: 1, duration: 0.8, delay: 0.15, ease: 'power2.out' });
		gsap.fromTo('.fab-btn', { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 0.55, delay: 0.5, ease: 'elastic.out(1, 0.6)' });

		// animated progress bars
		cardEls.forEach((card, i) => {
			const bar = card.querySelector('[data-progress-bar]') as HTMLElement | null;
			if (!bar) return;
			const target = bar.style.width;
			bar.style.width = '0%';
			gsap.to(bar, {
				width: target,
				duration: 1.1,
				ease: 'power2.out',
				delay: 0.35 + i * 0.09
			});
		});
	});

	function handleStudy(deck: Deck) {
		const current = getProgress(deck);
		const next = Math.min(100, current + 15);
		saveProgress(deck.id, next);
		setTimeout(() => {
			window.location.href = `${base}/deck/${deck.id}`;
		}, 220);
	}
</script>

<div class="min-h-screen bg-background text-on-background pb-24">
	<!-- TopAppBar -->
	<header class="fixed top-0 z-50 w-full bg-surface border-b border-outline-variant/30 top-app-bar">
		<div class="mx-auto flex h-16 max-w-md items-center justify-between px-container-padding md:max-w-4xl lg:max-w-6xl">
			<div class="flex items-center gap-3">
				<span class="material-symbols-outlined text-primary cursor-pointer active:scale-95 transition-transform">arrow_back</span>
				<h1 class="font-headline-md text-headline-md-mobile text-primary">FlashFlow</h1>
			</div>
		</div>
	</header>

	<!-- Content Canvas -->
	<main class="pt-24 px-container-padding">
		<div class="mx-auto max-w-md md:max-w-4xl lg:max-w-6xl">
			<section class="mb-8 md:mb-12">
				<h2 class="font-display-lg-mobile text-display-lg-mobile text-on-background mb-2 welcome-title">Welcome back!</h2>
				<p class="font-body-md text-body-md text-on-surface-variant welcome-sub">You have {decks.length} decks to review today.</p>
			</section>

			<!-- Bento Grid -->
			<div bind:this={deckContainer} class="grid grid-cols-1 gap-gutter md:grid-cols-2 lg:grid-cols-3">
				{#each decks as deck (deck.id)}
					{@const progress = getProgress(deck)}
					{@const icon = deckIcon(deck.id)}
					{@const bg = iconBg(deck.id)}
					{@const color = iconColor(deck.id)}
					<div class="deck-card bg-surface-container-lowest rounded-[24px] card-shadow transition-shadow duration-200 border border-outline-variant/30">
						<div class="p-4">
							<!-- Icon + badge row -->
							<div class="flex justify-between items-start mb-4">
								<div class="{bg} p-3 rounded-2xl">
									<span class="material-symbols-outlined {color}" style="font-variation-settings: 'FILL' 1; font-size: 24px;">{icon}</span>
								</div>
								<span class="font-label-md text-label-md bg-surface-container px-3 py-1 rounded-full text-secondary">{deck.cards.length} cards</span>
							</div>

							<!-- Title -->
							<h3 class="font-headline-md text-headline-md text-on-surface mb-1">{deck.title}</h3>

							<!-- Progress -->
							<div class="flex items-center justify-between mt-4 mb-6">
								<div class="flex-1 mr-4">
									<div class="flex justify-between mb-2">
										<span class="font-label-md text-label-md text-on-surface-variant">Progress</span>
										<span class="font-label-md text-label-md text-primary">{progress}%</span>
									</div>
									<div class="h-1 bg-surface-container rounded-full overflow-hidden">
										<div
											data-progress-bar
											class="h-full bg-primary rounded-full"
											style="width: {progress}%"
										></div>
									</div>
								</div>
							</div>

							<!-- CTA -->
							<button
								class="study-btn block w-full bg-primary text-on-primary font-label-md text-label-md py-4 rounded-[16px] hover:opacity-90 active:scale-[0.97] transition-all"
								onclick={() => handleStudy(deck)}
							>
								Study Now
							</button>
						</div>
					</div>
				{/each}
			</div>
		</div>
	</main>

	<!-- FAB -->
	<button
		class="fixed bottom-6 right-4 w-14 h-14 bg-primary text-on-primary rounded-2xl shadow-lg flex items-center justify-center active:scale-90 transition-all z-40 fab-btn md:right-8 lg:right-12"
		aria-label="Add deck"
	>
		<span class="material-symbols-outlined" style="font-size: 32px;">add</span>
	</button>
</div>
