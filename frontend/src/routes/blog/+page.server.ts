import type { Actions } from './$types';
import { fail } from '@sveltejs/kit';

export const actions: Actions = {
	submitBlog: async ({ request }) => {
		const data = await request.formData();
		const body = data.get('body')?.toString().trim();

		if (!body) return fail(400, { error: 'Blog body is required' });

		// save to DB
		console.log('Blog submitted:', body);
		return { success: true };
	},
	submitComment: async ({ request }) => {
		const data = await request.formData();
		const content = data.get('content')?.toString().trim();

		if (!content) return fail(400, { error: 'Comment content is required' });

		// save to DB
		console.log('Comment submitted:', content);
		return { success: true };
	}
} satisfies Actions;
