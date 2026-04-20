<script lang="ts">
	import { authClient } from '$lib/auth-client';
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { toast } from 'svelte-sonner';
	import { Sparkles, MailCheck } from '@lucide/svelte';
	import { z } from 'zod';

	let email = $state('');
	let sent = $state(false);
	let loading = $state<'google' | 'magic' | null>(null);

	const emailSchema = z.string().email('Enter a valid email');

	async function loginWithGoogle() {
		if (loading) return;

		loading = 'google';

		const { error } = await authClient.signIn.social({
			provider: 'google'
		});

		if (error) {
			toast.error('Login failed', {
				description: 'Something went wrong. Please try again.'
			});
			loading = null;
			return;
		}

		loading = null;
	}

	async function sendMagicLink() {
		if (loading) return;

		const result = emailSchema.safeParse(email);
		if (!result.success) {
			toast.error('Invalid email', {
				description: result.error.issues[0].message
			});
			return;
		}

		loading = 'magic';
		const { error } = await authClient.signIn.magicLink({ email });
		if (error) {
			toast.error('Failed to send link', {
				description: 'Please try again in a moment.'
			});
			loading = null;
			return;
		}
		sent = true;
		loading = null;

		toast.success('Magic link sent', {
			description: 'Check your inbox. Link expires in 15 minutes.'
		});
	}
</script>

<main class="grid min-h-svh place-items-center bg-muted p-4">
	<Card.Root class="w-full max-w-sm">
		<Card.Header>
			<Card.Title>Sign in</Card.Title>
			<Card.Description>
				{sent
					? `Link sent to ${email}`
					: `You can create an account here and if you already have one, we'll sign you in.`}
			</Card.Description>
		</Card.Header>

		<Card.Content class="space-y-3">
			{#if sent}
				<MailCheck class="mx-auto h-6 w-6 text-muted-foreground" />
				<p class="py-4 text-center text-sm text-muted-foreground">
					Check your inbox and click the link to continue. It expires in 15 minutes.
				</p>
				<Button
					variant="ghost"
					class="w-full"
					onclick={() => {
						sent = false;
						email = '';
					}}
				>
					Use a different email
				</Button>
			{:else}
				<Button
					variant="outline"
					class="w-full gap-2"
					onclick={loginWithGoogle}
					disabled={!!loading}
				>
					{#if loading === 'google'}
						<span class="size-4 animate-spin rounded-full border-2 border-border border-t-primary"
						></span>
					{:else}
						<svg width="16" height="16" viewBox="0 0 18 18">
							<path
								d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.616z"
								fill="#4285F4"
							/>
							<path
								d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z"
								fill="#34A853"
							/>
							<path
								d="M3.964 10.706A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.038l3.007-2.332z"
								fill="#FBBC05"
							/>
							<path
								d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"
								fill="#EA4335"
							/>
						</svg>
					{/if}
					Continue with Google
				</Button>

				<div class="flex items-center gap-2">
					<div class="h-px flex-1 bg-border"></div>
					<span class="text-xs text-muted-foreground">or</span>
					<div class="h-px flex-1 bg-border"></div>
				</div>

				<Input
					type="email"
					placeholder="you@example.com"
					required
					bind:value={email}
					disabled={!!loading}
					onkeydown={(e: KeyboardEvent) => e.key === 'Enter' && sendMagicLink()}
				/>

				<Button class="w-full" onclick={sendMagicLink} disabled={!!loading || !email}>
					{#if loading === 'magic'}
						<span
							class="size-4 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground"
						></span>
					{:else}
						<Sparkles /> Send magic link
					{/if}
				</Button>
			{/if}
		</Card.Content>
	</Card.Root>
</main>
