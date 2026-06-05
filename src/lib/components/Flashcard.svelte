<script lang="ts">
	import { renderMarkdown } from '$lib/utils/markdown';

	let { front, back, flipped = false, onclick } = $props();

	let frontHtml = $derived(renderMarkdown(front));
	let backHtml = $derived(renderMarkdown(back));
</script>

<div
	class="scene perspective-1000 h-[560px] w-full cursor-pointer rounded-3xl focus:outline-none"
	{onclick}
	onkeydown={(e) => {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			onclick?.();
		}
	}}
	role="button"
	tabindex="0"
>
	<div
		class="card transform-style-3d relative h-full w-full transition-transform duration-500 ease-out"
		class:flipped
	>
		<!-- Front Face -->
		<div
			class="face front absolute flex h-full w-full flex-col items-center justify-center overflow-auto rounded-3xl border border-outline-variant bg-surface-container-lowest p-8 text-center shadow-[0_4px_24px_rgba(30,41,59,0.06)] backface-hidden"
		>
			<div class="prose max-w-none prose-headings:text-on-background prose-p:text-lg prose-li:text-lg prose-p:leading-relaxed prose-li:leading-relaxed prose-p:text-on-surface prose-li:text-on-surface">
				{@html frontHtml}
			</div>
			<div class="absolute bottom-4 text-xs font-semibold tracking-widest text-on-surface-variant/60 uppercase">Front</div>
		</div>

		<!-- Back Face -->
		<div
			class="face back absolute flex h-full w-full rotate-y-180 flex-col items-center justify-center overflow-auto rounded-3xl border border-outline-variant bg-surface-container-lowest p-8 text-center shadow-[0_4px_24px_rgba(30,41,59,0.06)] backface-hidden"
		>
			<div class="prose max-w-none prose-headings:text-on-background prose-p:text-lg prose-li:text-lg prose-p:leading-relaxed prose-li:leading-relaxed prose-p:text-on-surface prose-li:text-on-surface">
				{@html backHtml}
			</div>
			<div class="absolute bottom-4 text-xs font-semibold tracking-widest text-on-surface-variant/60 uppercase">Back</div>
		</div>
	</div>
</div>

<style>
	.perspective-1000 {
		perspective: 1000px;
	}
	.transform-style-3d {
		transform-style: preserve-3d;
	}
	.backface-hidden {
		backface-visibility: hidden;
	}
	.rotate-y-180 {
		transform: rotateY(180deg);
	}
	.flipped {
		transform: rotateY(180deg);
	}

	/* Scrollbar styling */
	.face::-webkit-scrollbar {
		width: 8px;
	}
	.face::-webkit-scrollbar-track {
		background: transparent;
	}
	.face::-webkit-scrollbar-thumb {
		background: #c3c6d4;
		border-radius: 4px;
	}
	.face::-webkit-scrollbar-thumb:hover {
		background: #1a58b7;
	}
</style>
