<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { CheckCircleIcon } from '@lucide/svelte/icons';
</script>

<main class="grid min-h-svh place-items-center bg-muted p-4">
	<div class="flex flex-col items-center gap-6 text-center">
		<div class="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
			<CheckCircleIcon class="h-10 w-10 text-primary" />
		</div>

		<div class="space-y-2">
			<h1 class="text-3xl font-bold tracking-tight">Payment Successful!</h1>
			<p class="text-muted-foreground">
				Thank you for your purchase. Your order has been confirmed.
			</p>
		</div>

		<Button href="/">Continue Shopping</Button>
	</div>
</main>
