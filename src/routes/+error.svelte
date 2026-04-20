<script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { resolve } from '$app/paths';
	import Button from '$lib/components/ui/button/button.svelte';

	onMount(() => {
		console.error(page.error);
	});
</script>

<div class="my-auto flex min-h-screen flex-col items-center justify-center">
	<div class="flex flex-col items-center justify-center gap-4">
		{#if page.status === 404}
			<h1 class="text-3xl font-bold text-red-600">Page not found</h1>
		{:else}
			<h1 class="text-3xl font-bold text-red-600">Oops! Something went wrong</h1>
		{/if}
		<p class="mb-2 text-center text-lg text-primary">
			{page.error?.message || 'An unexpected error occurred'}
		</p>
		<div class="flex gap-3">
			<Button
				onclick={() => history.back()}
				class="bg-gray-800 px-5 py-2 font-medium text-white transition hover:bg-gray-700"
			>
				Try again
			</Button>
			<Button
				href="/"
				variant="outline"
				class="border font-medium text-gray-600 transition hover:bg-gray-100"
			>
				Back to Home
			</Button>
		</div>
	</div>
</div>
