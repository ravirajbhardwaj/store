// src/routes/api/webhooks/+server.ts
import { Webhooks } from '@dodopayments/sveltekit';
import { DODO_PAYMENTS_WEBHOOK_KEY } from '$env/static/private';
import { db } from '$lib/server/db';
import { order, user } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const POST = Webhooks({
	webhookKey: DODO_PAYMENTS_WEBHOOK_KEY,

	onPaymentSucceeded: async (payload) => {
		const data = payload.data;

		const customer = await db.query.user.findFirst({
			where: eq(user.email, data.customer.email)
		});

		if (!customer) {
			console.error('User not found:', data.customer.email);
			return;
		}

		await db.insert(order).values({
			id: crypto.randomUUID(),
			productId: data.metadata.product_id, // ✅ already your dodoId
			userId: customer.id,
			status: 'succeeded',
			amount: data.total_amount,
			createdAt: new Date(),
			updatedAt: new Date()
		});
	},

	onPaymentFailed: async (payload) => {
		const data = payload.data;

		const customer = await db.query.user.findFirst({
			where: eq(user.email, data.customer.email)
		});

		if (!customer) return;

		await db.insert(order).values({
			id: crypto.randomUUID(),
			productId: data.metadata.product_id, // ✅ already your dodoId
			userId: customer.id,
			status: 'failed',
			amount: data.total_amount,
			createdAt: new Date(),
			updatedAt: new Date()
		});
	},

	onRefundSucceeded: async (payload) => {
		await db
			.update(order)
			.set({ status: 'refunded', updatedAt: new Date() })
			.where(eq(order.id, payload.data.payment_id));
	}
});
