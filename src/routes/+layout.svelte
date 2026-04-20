<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { ModeWatcher } from 'mode-watcher';
	import { Toaster } from '$lib/components/ui/sonner';
	import { toggleMode } from 'mode-watcher';
	import { Button } from '$lib/components/ui/button';
	import { mode } from 'mode-watcher';
	import { Sheet, SheetContent, SheetHeader, SheetTitle } from '$lib/components/ui/sheet';
	import { ShoppingCartIcon, CreditCardIcon, XIcon, SunIcon, MoonIcon } from '@lucide/svelte/icons';
	import { cart } from '$lib/stores/cart.svelte';

	let isCartOpen = $derived(cart.isOpen);

	let { children } = $props();
</script>

<ModeWatcher defaultMode="dark" />
<Toaster
	theme={mode.current}
	position="bottom-right"
	richColors
	toastOptions={{
		class: 'border shadow-lg backdrop-blur-sm',
		classes: {
			success: 'bg-success text-success-foreground border-success/30',
			error: 'bg-destructive text-destructive-foreground border-destructive/30',
			warning: 'bg-warning text-warning-foreground border-warning/30',
			default: 'bg-card text-card-foreground border-border'
		}
	}}
/>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<main class="h-full w-full antialiased">
	{@render children()}

	<div class="fixed top-4 right-4 z-50 hidden items-center gap-2 md:flex">
		<Button onclick={toggleMode} variant="outline" size="icon-sm">
			<SunIcon
				class="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90"
			/>
			<MoonIcon
				class="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0"
			/>
			<span class="sr-only">Toggle theme</span>
		</Button>
	</div>
</main>

<!-- 🛒 Cart Sheet -->
<!-- Replace your Sheet section in +layout.svelte -->

<Sheet open={isCartOpen} onOpenChange={(v) => (v ? cart.open() : cart.close())}>
	<SheetContent side="right" class="flex w-96 flex-col gap-0 p-0">
		<!-- Header -->
		<div class="flex items-center justify-between border-b px-6 py-4">
			<div class="flex items-center gap-2">
				<ShoppingCartIcon class="h-4 w-4 text-muted-foreground" />
				<h2 class="text-sm font-semibold">Your Cart</h2>
				{#if cart.items.length > 0}
					<span
						class="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground"
					>
						{cart.items.length}
					</span>
				{/if}
			</div>
		</div>

		<!-- Items -->
		<div class="flex-1 overflow-y-auto px-6 py-4">
			{#if cart.items.length === 0}
				<div class="flex flex-col items-center justify-center gap-3 py-16 text-center">
					<div class="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
						<ShoppingCartIcon class="h-6 w-6 text-muted-foreground" />
					</div>
					<p class="text-sm font-medium">Your cart is empty</p>
					<p class="text-xs text-muted-foreground">Add items to get started</p>
				</div>
			{:else}
				<ul class="flex flex-col divide-y">
					{#each cart.items as item (item.id)}
						<li class="flex items-center gap-4 py-4">
							<!-- Item color block placeholder -->
							<img
								src={item.image}
								alt={item.name}
								class="h-14 w-14 shrink-0 rounded-md bg-muted object-cover"
							/>

							<div class="flex min-w-0 flex-1 flex-col gap-0.5">
								<p class="truncate text-sm font-medium">{item.name}</p>
								<p class="text-sm text-muted-foreground">
									${item.price}
								</p>
							</div>

							<Button
								variant="ghost"
								size="icon"
								class="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive"
								onclick={() => cart.remove(item)}
							>
								<XIcon class="h-4 w-4" />
							</Button>
						</li>
					{/each}
				</ul>
			{/if}
		</div>

		<!-- Footer -->
		{#if cart.items.length > 0}
			<div class="flex flex-col gap-3 border-t px-6 py-4">
				<div class="flex items-center justify-between text-sm">
					<span class="text-muted-foreground">Subtotal</span>
					<span class="font-semibold">${cart.total}</span>
				</div>
				<p class="text-xs text-muted-foreground">Shipping calculated at checkout</p>
				<Button class="w-full gap-2">
					<CreditCardIcon class="h-4 w-4" />
					Checkout
				</Button>
				<Button variant="outline" class="w-full" onclick={() => cart.close()}>
					Continue Shopping
				</Button>
			</div>
		{/if}
	</SheetContent>
</Sheet>
