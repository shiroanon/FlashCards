<script>
	import './layout.css';
	import 'katex/dist/katex.min.css';
	import favicon from '$lib/assets/favicon.svg';
	import { onMount } from 'svelte';
	import { gsap } from 'gsap';

	let { children } = $props();

	onMount(() => {
		gsap.fromTo(
			'.top-app-bar',
			{ opacity: 0, y: -20 },
			{ opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
		);
		gsap.fromTo(
			'.bottom-nav-bar',
			{ opacity: 0, y: 20 },
			{ opacity: 1, y: 0, duration: 0.6, delay: 0.2, ease: 'power3.out' }
		);
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<meta name="theme-color" content="#f8f9ff" />
</svelte:head>

{#if children}
	<div class="flex flex-col min-h-screen bg-background text-on-background">
		{@render children()}
	</div>
{/if}
