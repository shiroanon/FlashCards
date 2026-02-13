<script lang="ts">
	let { id, title, description, cardCount } = $props();
</script>

<a href="/deck/{id}" class="group block">
	<div
		class="flex h-full transform flex-col justify-between rounded-xl border-2 border-red-500 bg-black p-6 transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_0_20px_rgba(255,0,0,0.4)]"
	>
		<div>
			<h3 class="mb-2 text-xl font-bold text-red-500 transition-colors group-hover:text-red-400">
				{title}
			</h3>
			<p class="mb-4 text-sm text-gray-400">{description}</p>
		</div>
		<div class="mt-4 flex items-center justify-between border-t border-red-900/30 pt-4">
			<span class="font-mono text-xs text-red-500/70">{cardCount} CARDS</span>
			<span class="text-red-500 opacity-0 transition-opacity group-hover:opacity-100"> → </span>
		</div>
	</div>
</a>
