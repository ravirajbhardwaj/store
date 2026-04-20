import { Webhooks } from '@dodopayments/sveltekit';
import { DODO_PAYMENTS_WEBHOOK_KEY } from '$env/static/private';
import { db } from '$lib/server/db';
import { order, user } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { json } from '@sveltejs/kit';

export const POST = Webhooks({
	webhookKey: DODO_PAYMENTS_WEBHOOK_KEY,

	onPaymentSucceeded: async (payload) => {
		const data = payload.data;

		if (!data.customer?.email) {
			console.error('Invalid payload: missing customer email');
			return;
		}

		const customer = await db.query.user.findFirst({
			where: eq(user.email, data.customer.email)
		});

		if (!customer) {
			console.error('User not found:', data.customer.email);
			return;
		}

		if (!data.metadata?.product_id) {
			console.error('Invalid payload: missing product_id');
			return;
		}

		await db.insert(order).values({
			id: crypto.randomUUID(),
			productId: data.metadata.product_id,
			userId: customer.id,
			status: 'succeeded',
			amount: data.total_amount,
			createdAt: new Date(),
			updatedAt: new Date()
		});
	},

	onPaymentFailed: async (payload) => {
		const data = payload.data;

		if (!data.customer?.email) {
			console.error('Invalid payload: missing customer email');
			return;
		}

		const customer = await db.query.user.findFirst({
			where: eq(user.email, data.customer.email)
		});

		if (!customer) {
			console.error('User not found:', data.customer.email);
			return;
		}

		if (!data.metadata?.product_id) {
			console.error('Invalid payload: missing product_id');
			return;
		}

		await db.insert(order).values({
			id: crypto.randomUUID(),
			productId: data.metadata.product_id,
			userId: customer.id,
			status: 'failed',
			amount: data.total_amount,
			createdAt: new Date(),
			updatedAt: new Date()
		});
	}
});
