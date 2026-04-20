import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { eq } from 'drizzle-orm';
import { product as productTable, user } from '$lib/server/db/schema';

export const load: PageServerLoad = async ({ params, locals }) => {
	const { slug } = params;

	// Validate that slug parameter exists and is not empty
	if (!slug || slug.trim() === '') {
		throw error(400, {
			message: 'Product slug is required'
		});
	}

	// Fetch the product from the database
	const product = await db.query.product.findFirst({
		where: eq(productTable.slug, slug)
	});

	// Throw 404 error if product not found
	if (!product) {
		throw error(404, {
			message: 'Product not found'
		});
	}

	return {
		product,
		user: locals.user,
		session: locals.session
	};
};
