<script lang="ts">
	import { ShoppingCartIcon, UserIcon, UserPlus } from '@lucide/svelte/icons';
	import { Button } from '$lib/components/ui/button';
	import { AspectRatio } from '$lib/components/ui/aspect-ratio';
	import { Separator } from '$lib/components/ui/separator';
	import { authClient } from '$lib/auth-client';

	import { cart } from '$lib/stores/cart.svelte';

	let { data } = $props();
	const session = authClient.useSession();

	let imagesLoaded = $state<Set<number>>(new Set());

	function onImageLoad(id: number) {
		imagesLoaded = new Set([...imagesLoaded, id]);
	}
</script>

<main class="mx-auto w-full max-w-7xl bg-background px-4 py-2 pb-6 sm:px-6 lg:px-8">
	<!-- Header -->
	<header class="w-full bg-background">
		<div
			class="mx-auto flex h-14 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8"
		>
			<!-- Left: Logo -->
			<a href="/" class="flex items-center" aria-label="Engineezy Home">
				<span class="text-xl font-semibold text-foreground uppercase">Store</span>
			</a>

			<!-- Right: Icons -->
			<div class="flex items-center gap-1">
				<!-- Cart -->
				<Button
					onclick={() => cart.open()}
					variant="ghost"
					size="icon-sm"
					aria-label="Cart"
					class="relative"
				>
					<ShoppingCartIcon class="h-[1.2rem] w-[1.2rem]" />
					{#if cart.items.length > 0}
						<span
							class="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground"
						>
							{cart.items.length}
						</span>
					{/if}
					<span class="sr-only">Open cart</span>
				</Button>

				<!-- User — dropdown if logged in, redirect if not -->
				{#if $session.data?.user.email}
					<Button variant="ghost" size="icon-sm" aria-label="Sign in">
						<UserIcon class="size-[1.2rem]" />
					</Button>
				{:else}
					<Button variant="ghost" size="icon-sm" href="/auth" aria-label="Sign in">
						<UserPlus class="size-[1.2rem]" />
					</Button>
				{/if}
			</div>
		</div>
	</header>

	<!-- Product Grid -->
	<div class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
		{#each data.products as product (product.id)}
			<a
				href="/products/{product.slug}"
				class="group block rounded-2xl transition-all duration-300 hover:-translate-y-1"
			>
				<!-- Card Surface -->
				<div
					class="rounded-2xl border bg-background/60 p-2 backdrop-blur-sm transition-all duration-300 group-hover:border-muted group-hover:shadow-lg"
				>
					<!-- Image -->
					<AspectRatio ratio={1} class="overflow-hidden rounded-xl bg-muted">
						<img
							src={product.image}
							alt={product.name}
							class="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
							loading="lazy"
						/>
					</AspectRatio>
				</div>

				<!-- Content -->
				<div class="mt-3 space-y-1 px-1">
					<p class="line-clamp-2 text-sm leading-snug font-medium tracking-tight text-foreground">
						{product.name}
					</p>

					<p class="text-sm font-semibold text-foreground">
						Rs. {product.price}
					</p>
				</div>
			</a>
		{/each}
	</div>
</main>
