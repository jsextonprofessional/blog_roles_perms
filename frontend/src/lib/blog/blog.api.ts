import { apiFetch } from '$lib/api';
import { auth } from '$lib/stores/auth';
import { get } from 'svelte/store';
import type { Article, Comment } from './types';

export async function getArticles(): Promise<Article[]> {
	const response = await apiFetch('blog', 'articles', {
		method: 'GET'
	});
	return response.articles || [];
}

export async function createArticle(title: string, content: string, token?: string): Promise<void> {
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

export async function editArticle(
	articleId: string,
	title: string,
	content: string,
	token?: string
) {
	const authToken = get(auth).token;

	if (!authToken) {
		throw new Error('Authentication required');
	}

	return await apiFetch('blog', `articles/${articleId}`, {
		method: 'PATCH',
		headers: {
			Authorization: `Bearer ${authToken}`
		},
		body: JSON.stringify({ title, content })
	});
}

export async function deleteArticle(articleId: string, token?: string) {
	const authToken = token || get(auth).token;

	if (!authToken) {
		throw new Error('Authentication required');
	}

	return await apiFetch('blog', `articles/${articleId}`, {
		method: 'DELETE',
		headers: {
			Authorization: `Bearer ${authToken}`
		}
	});
}

// fetch comments for an article (requires authentication)
export async function getComments(articleId: string, token?: string): Promise<Comment[]> {
	const authToken = token || get(auth).token;

	if (!authToken) {
		throw new Error('Authentication required to fetch comments');
	}

	const response = await apiFetch('blog', `articles/${articleId}/comments`, {
		method: 'GET',
		headers: {
			Authorization: `Bearer ${authToken}`
		}
	});
	return response.comments || [];
}

// create a new comment
export async function createComment(articleId: string, content: string, token?: string) {
	const authToken = token || get(auth).token;

	if (!authToken) {
		throw new Error('Authentication required to create comments');
	}

	return await apiFetch('blog', `articles/${articleId}/comments`, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${authToken}`
		},
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

export async function deleteComment(commentId: string, token?: string) {
	const authToken = token || get(auth).token;

	if (!authToken) {
		throw new Error('Authentication required to delete comments');
	}

	return await apiFetch('blog', `comments/${commentId}`, {
		method: 'DELETE',
		headers: {
			Authorization: `Bearer ${authToken}`
		}
	});
}
