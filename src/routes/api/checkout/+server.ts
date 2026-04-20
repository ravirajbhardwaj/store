import { Checkout } from '@dodopayments/sveltekit';
import {
	DODO_PAYMENTS_API_KEY,
	DODO_PAYMENTS_RETURN_URL,
	DODO_PAYMENTS_ENVIRONMENT
} from '$env/static/private';

const checkoutGetHandler = Checkout({
	bearerToken: DODO_PAYMENTS_API_KEY,
	returnUrl: DODO_PAYMENTS_RETURN_URL,
	environment: DODO_PAYMENTS_ENVIRONMENT as 'test_mode' | 'live_mode',
	type: 'dynamic'
});

const checkoutPostHandler = Checkout({
	bearerToken: DODO_PAYMENTS_API_KEY,
	returnUrl: DODO_PAYMENTS_RETURN_URL,
	environment: DODO_PAYMENTS_ENVIRONMENT as 'test_mode' | 'live_mode',
	type: 'dynamic'
});

export const GET = checkoutGetHandler.GET;
export const POST = checkoutPostHandler.POST;
