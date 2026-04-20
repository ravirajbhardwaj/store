import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { product } from '$lib/server/db/schema';
import type { InferSelectModel } from 'drizzle-orm';

export const load: PageServerLoad = async ({ locals }) => {
	let products: InferSelectModel<typeof product>[] = [];
	try {
		products = await db.query.product.findMany();
	} catch (error) {
		console.error('Failed to fetch products:', error);
		throw new Error('Failed to load products');
	}
	return {
		products,
		user: locals.user,
		session: locals.session
	};
};
