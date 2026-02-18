import { apiFetch } from '$lib/api';
import { auth } from '$lib/stores/auth';
import { get } from 'svelte/store';
import type { Article } from './types';

export async function getArticles(): Promise<Article[]> {
	const response = await apiFetch('blog', 'articles', {
		method: 'GET'
	});
	return response.articles || [];
}

export async function createArticle(title: string, content: string, token?: string) {
	// Use provided token or get from store (for client-side calls)
	const authToken = token || get(auth).token;

	if (!authToken) {
		throw new Error('Authentication required');
	}

	return await apiFetch('blog', 'articles', {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${authToken}`
		},
		body: JSON.stringify({ title, content })
	});
}

// edit an article
export async function editArticle(articleId: string, title: string, content: string) {
	return await apiFetch('blog', `articles/${articleId}`, {
		method: 'PUT',
		body: JSON.stringify({ title, content })
	});
}

// delete an article
export async function deleteArticle(articleId: string) {
	return await apiFetch('blog', `articles/${articleId}`, {
		method: 'DELETE'
	});
}

// fetch comments for an article
export async function getComments(articleId: string): Promise<Comment[]> {
	return await apiFetch('blog', `articles/${articleId}/comments`, {
		method: 'GET'
	});
}

// create a new comment
export async function createComment(articleId: string, content: string) {
	return await apiFetch('blog', `articles/${articleId}/comments`, {
		method: 'POST',
		body: JSON.stringify({ content })
	});
}

// edit a comment
export async function editComment(commentId: string, content: string) {
	return await apiFetch('blog', `comments/${commentId}`, {
		method: 'PUT',
		body: JSON.stringify({ content })
	});
}

// delete a comment
export async function deleteComment(commentId: string) {
	return await apiFetch('blog', `comments/${commentId}`, {
		method: 'DELETE'
	});
}
