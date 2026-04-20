import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';

export const load: PageServerLoad = async () => {
	// db call to fetch products
	let products: any;
	try {
		products = await db.query.product.findMany();
	} catch (error) {
		console.error('Failed to fetch products:', error);
		products = [];
	}
	return {
		products
	};
};
