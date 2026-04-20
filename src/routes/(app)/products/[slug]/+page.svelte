<script lang="ts">
	import { ArrowLeftIcon, CreditCardIcon, ShoppingCartIcon } from '@lucide/svelte/icons';
	import { Button } from '$lib/components/ui/button';
	import { Separator } from '$lib/components/ui/separator';
	import { Badge } from '$lib/components/ui/badge';
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Tabs, TabsContent, TabsList, TabsTrigger } from '$lib/components/ui/tabs';

	import { onMount } from 'svelte';
	import { DodoPayments } from 'dodopayments-checkout';

	let { data } = $props();

	let isLoading = $state(false);

	onMount(() => {
		DodoPayments.Initialize({
			mode: 'test',
			displayType: 'overlay',
			onEvent: (event) => {
				if (event.event_type === 'checkout.opened') isLoading = false;
				if (event.event_type === 'checkout.error') {
					isLoading = false;
					console.error('Checkout error:', event.data?.message);
				}
			}
		});
	});

	async function handleCheckout() {
		console.log('user', data?.user);
		if (!data?.user.email) {
			window.location.href = '/auth'; // 👈 goes to auth page
			return;
		}

		isLoading = true;
		try {
			const res = await fetch('/api/checkout', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					billing: {
						city: '',
						country: 'IN',
						state: '',
						street: '',
						zipcode: ''
					},
					customer: {
						email: data.user.email, // ✅ safe now
						name: data.user.name
					},
					product_id: data.product.id,
					quantity: 1,
					payment_link: true
				})
			});

			const { checkout_url } = await res.json();
			await DodoPayments.Checkout.open({ checkoutUrl: checkout_url });
			isLoading = false;
		} catch (err) {
			console.error('Checkout API error:', err);
			isLoading = false;
		}
	}

	import { cart } from '$lib/stores/cart.svelte.ts';

	let activeTab = $state('description');
</script>

<div class="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
	<!-- Back link -->
	<a
		href="/"
		class="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
	>
		<ArrowLeftIcon class="size-4" />
		Back to collection
	</a>

	<div class="mt-4 grid grid-cols-1 gap-10 lg:grid-cols-2">
		<!-- LEFT: Image Carousel -->
		<div class="flex flex-col gap-3">
			<!-- Main image -->
			<div class="relative overflow-hidden rounded-lg bg-muted">
				<img src={data.product.image} alt={data.product.name} class="h-105 w-full object-cover" />
			</div>
		</div>

		<!-- RIGHT: data.Product Info -->
		<Card class="h-fit">
			<CardHeader>
				<CardTitle class="text-2xl sm:text-3xl">
					{data.product.name}
				</CardTitle>
			</CardHeader>

			<CardContent class="flex flex-col gap-5">
				{#if data.product.badge}
					<Badge class="w-fit">{data.product.badge}</Badge>
				{/if}

				<p class="text-xl font-semibold">
					Rs. {data.product.price}
				</p>

				<Separator />

				<!-- Actions -->
				<div class="flex gap-3">
					<Button onclick={handleCheckout} disabled={isLoading} class="flex-1 gap-2" size="sm">
						{#if isLoading}
							Loading...
						{:else}
							<CreditCardIcon class="size-4" />
							Buy Now
						{/if}
					</Button>

					<Button
						onclick={() => {
							if (cart.isInCart(data.product.id)) {
								cart.open(); // already in cart → just open
							} else {
								cart.add({
									id: data.product.id,
									name: data.product.name,
									price: data.product.price,
									image: data.product.image
								});
								cart.open();
							}
						}}
						variant="outline"
						class="flex-1 gap-2"
						size="sm"
					>
						<ShoppingCartIcon class="size-4" />
						Add to Cart
					</Button>
				</div>

				<Tabs bind:value={activeTab} class="w-full">
					<TabsList class="grid w-full grid-cols-3">
						<TabsTrigger value="description">Description</TabsTrigger>
						<TabsTrigger value="reviews">Reviews</TabsTrigger>
						<TabsTrigger value="specs">Specs</TabsTrigger>
					</TabsList>

					<TabsContent value="description">
						<div class="mt-3 text-sm whitespace-pre-line text-muted-foreground">
							{data.product.description}
						</div>
					</TabsContent>

					<TabsContent value="reviews">
						<p class="mt-3 text-sm text-muted-foreground">No reviews yet.</p>
					</TabsContent>

					<TabsContent value="specs">
						<p class="mt-3 text-sm text-muted-foreground">No specs available.</p>
					</TabsContent>
				</Tabs>
			</CardContent>
		</Card>
	</div>
</div>
