import type { Actions } from '$app/types';

export const actions: Actions = {
	submitBlog: async (event) => {
		const formData = await event.request.formData();

		const body = formData.get('body');
		console.log('Form body:', body);
	},
	submitComment: async (event) => {}
} satisfies Actions;
