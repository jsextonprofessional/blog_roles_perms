import { getArticles, getComments } from '$lib/blog/blog.api';
import { auth } from '$lib/stores/auth';
import { get } from 'svelte/store';
import type { Article, ArticleWithComments } from '$lib/blog/types';
import type { PageLoad } from './$types';

// Run on client-side only to avoid SSR fetch issues
export const ssr = false;

export const load: PageLoad = async () => {
	try {
		const articles = await getArticles();
		const authStore = get(auth);
		const token = authStore.token;

		// Only fetch comments if user is authenticated
		if (!token) {
			// Return articles without comments for non-authenticated users
			const articlesWithoutComments: ArticleWithComments[] = articles.map((article: Article) => ({
				...article,
				comments: []
			}));
			return { articles: articlesWithoutComments };
		}

		// Fetch comments for each article for authenticated users
		const articlesWithComments: ArticleWithComments[] = await Promise.all(
			articles.map(async (article: Article) => {
				try {
					const comments = await getComments(article.id, token);
					return { ...article, comments };
				} catch (error) {
					console.error(`Failed to load comments for article ${article.id}:`, error);
					return { ...article, comments: [] };
				}
			})
		);
		return { articles: articlesWithComments };
	} catch (error) {
		console.error('Failed to load articles:', error);
		return { articles: [] };
	}
};
