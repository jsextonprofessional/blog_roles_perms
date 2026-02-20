import { createArticle, createComment, deleteComment } from '$lib/blog/blog.api';
import type { Actions } from './$types';
import { fail } from '@sveltejs/kit';

export const actions: Actions = {
	createArticle: async ({ request }) => {
		const data = await request.formData();
		const title = data.get('title')?.toString().trim();
		const body = data.get('body')?.toString().trim();
		const token = data.get('token')?.toString();

		if (!title) return fail(400, { error: 'Title is required' });
		if (!body) return fail(400, { error: 'Body is required' });
		if (!token) return fail(401, { error: 'Authentication required' });

		try {
			await createArticle(title, body, token);
			return { success: true };
		} catch (error) {
			console.error('Error creating article:', error);
			return fail(500, { error: 'Failed to create article' });
		}
	},
	createComment: async ({ request }) => {
		const data = await request.formData();
		const content = data.get('content')?.toString().trim();
		const articleId = data.get('articleId')?.toString();
		const token = data.get('token')?.toString();

		if (!content) return fail(400, { error: 'Comment content is required' });
		if (!articleId) return fail(400, { error: 'Article ID is required' });
		if (!token) return fail(401, { error: 'Authentication required' });

		try {
			await createComment(articleId, content, token);
			return { success: true };
		} catch (error) {
			console.error('Error creating comment:', error);
			return fail(500, { error: 'Failed to create comment' });
		}
	},
	deleteComment: async ({ request }) => {
		const data = await request.formData();
		const commentId = data.get('commentId')?.toString();
		const token = data.get('token')?.toString();

		if (!commentId) return fail(400, { error: 'Comment ID is required' });
		if (!token) return fail(401, { error: 'Authentication required' });

		try {
			await deleteComment(commentId, token);
			return { success: true };
		} catch (error) {
			console.error('Error deleting comment:', error);
			return fail(500, { error: 'Failed to delete comment' });
		}
	}
} satisfies Actions;
