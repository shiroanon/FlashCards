<script lang="ts">
	import { base } from '$app/paths';
	let { id, title, description, cardCount } = $props();
</script>

<a href="{base}/deck/{id}" class="group block">
	<div
				class="flex h-full transform flex-col justify-between rounded-xl border border-slate-700/70 bg-slate-900/70 p-6 transition-all duration-300 group-hover:-translate-y-1 group-hover:border-sky-500/60 group-hover:shadow-[0_0_18px_rgba(14,165,233,0.15)]"
			>
				<div>
					<h3 class="mb-2 text-xl font-bold text-sky-300 transition-colors group-hover:text-sky-200">
						{title}
					</h3>
					<p class="mb-4 text-sm text-slate-400">{description}</p>
				</div>
				<div class="mt-4 flex items-center justify-between border-t border-slate-700/60 pt-4">
					<span class="font-mono text-xs text-slate-400">{cardCount} CARDS</span>
					<span class="text-slate-500 opacity-0 transition-opacity group-hover:opacity-100"> → </span>
				</div>
			</div>
</a>
