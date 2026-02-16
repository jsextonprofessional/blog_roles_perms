import { getArticles } from '$lib/blog/blog.api';
import type { PageLoad } from './$types';

// Run on client-side only to avoid SSR fetch issues
export const ssr = false;

export const load: PageLoad = async () => {
	try {
		const articles = await getArticles();
		return { articles };
	} catch (error) {
		console.error('Failed to load articles:', error);
		return { articles: [] };
	}
};
