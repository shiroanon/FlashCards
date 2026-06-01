<script lang="ts">
	import { renderMarkdown } from '$lib/utils/markdown';

	let { front, back, flipped = false, onclick } = $props();

	// We render markdown for both sides
	// Using $derived to reactively update when props change
	let frontHtml = $derived(renderMarkdown(front));
	let backHtml = $derived(renderMarkdown(back));
</script>

<!-- Container/Scene -->
<!-- Container/Scene -->
<div
	class="scene perspective-1000 h-[600px] w-full cursor-pointer rounded-xl focus:outline-none"
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
	<!-- Card Object -->
	<div
		class="card transform-style-3d relative h-full w-full transition-transform duration-300"
		class:flipped
	>
		<!-- Front Face -->
		<div
			class="face front absolute flex h-full w-full flex-col items-center justify-center overflow-auto rounded-xl border border-sky-500/40 bg-slate-950/60 p-8 text-center shadow-[0_0_20px_rgba(14,165,233,0.15)] backface-hidden"
		>
			<div
				class="prose max-w-none prose-invert prose-headings:text-sky-300 prose-p:text-2xl prose-li:text-2xl prose-p:leading-relaxed prose-li:leading-relaxed"
			>
				{@html frontHtml}
			</div>
			<div class="absolute bottom-4 text-xs tracking-widest text-sky-400/50 uppercase">Front</div>
		</div>

		<!-- Back Face -->
		<div
			class="face back absolute flex h-full w-full rotate-y-180 flex-col items-center justify-center overflow-auto rounded-xl border border-indigo-500/40 bg-slate-950/60 p-8 text-center shadow-[0_0_20px_rgba(99,102,241,0.15)] backface-hidden"
		>
			<div
				class="prose max-w-none prose-invert prose-headings:text-indigo-300 prose-p:text-2xl prose-li:text-2xl prose-p:leading-relaxed prose-li:leading-relaxed"
			>
				{@html backHtml}
			</div>
			<div class="absolute bottom-4 text-xs tracking-widest text-indigo-400/50 uppercase">Back</div>
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

	/* Scrollbar styling for content overflow */
	.face::-webkit-scrollbar {
		width: 8px;
	}
	.face::-webkit-scrollbar-track {
		background: #000;
	}
	.face::-webkit-scrollbar-thumb {
		background: #ef4444;
		border-radius: 4px;
	}
	.face::-webkit-scrollbar-thumb:hover {
		background: #0ea5e9;
	}
</style>
