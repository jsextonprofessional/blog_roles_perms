import { createArticle } from '$lib/blog/blog.api';
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

	// TODO: Add editArticle and deleteArticle actions following the same pattern
	submitBlog: async ({ request }) => {
		const data = await request.formData();
		const title = data.get('title')?.toString().trim();
		const body = data.get('body')?.toString().trim();

		if (!title) return fail(400, { error: 'Blog title is required' });
		if (!body) return fail(400, { error: 'Blog body is required' });

		// save to DB
		createArticle(title, body).catch((err) => {
			console.error('Error creating article:', err);
		});
		console.log('Blog submitted:', { title, body });
		return { success: true };
	},
	submitComment: async ({ request }) => {
		const data = await request.formData();
		const content = data.get('content')?.toString().trim();

		if (!content) return fail(400, { error: 'Comment content is required' });

		// save to DB
		console.log('Comment submitted:', { content });
		return { success: true };
	}
} satisfies Actions;
