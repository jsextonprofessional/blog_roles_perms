import { apiFetch } from '$lib/api';
import type { Article } from './types';

// Fetch all articles (public endpoint)
export async function getArticles(): Promise<Article[]> {
	const response = await apiFetch('blog', 'articles', {
		method: 'GET'
	});
	return response.articles || [];
}

export async function fetchComments() {
	return await apiFetch('blog', '/comments');
}
