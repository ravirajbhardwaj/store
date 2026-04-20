import { createAuthClient } from 'better-auth/svelte';
import { magicLinkClient } from 'better-auth/client/plugins';
import { BASE_URL } from '$env/static/private';

export const authClient = createAuthClient({
	baseURL: 'http://localhost:5173/',
	plugins: [magicLinkClient()]
});
