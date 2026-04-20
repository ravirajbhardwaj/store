import { Checkout } from '@dodopayments/sveltekit';
import {
	DODO_PAYMENTS_API_KEY,
	DODO_PAYMENTS_RETURN_URL,
	DODO_PAYMENTS_ENVIRONMENT
} from '$env/static/private';
import { json, type RequestEvent } from '@sveltejs/kit';
import { z } from 'zod';

const checkoutConfig = {
	bearerToken: DODO_PAYMENTS_API_KEY,
	returnUrl: DODO_PAYMENTS_RETURN_URL,
	environment: DODO_PAYMENTS_ENVIRONMENT as 'test_mode' | 'live_mode',
	type: 'dynamic' as const
};

const checkoutHandler = Checkout(checkoutConfig);

const checkoutSchema = z.object({
	product_id: z.string(),
	quantity: z.number().int().positive().optional().default(1)
});

export const GET = checkoutHandler.GET;

export const POST = async (event: RequestEvent) => {
	const cloned = event.request.clone();

	let body;
	try {
		body = await cloned.json();
	} catch {
		return json({ error: 'Invalid JSON' }, { status: 400 });
	}

	const result = checkoutSchema.safeParse(body);
	if (!result.success) {
		return json({ error: 'Invalid request' }, { status: 400 });
	}

	return checkoutHandler.POST(event);
};
