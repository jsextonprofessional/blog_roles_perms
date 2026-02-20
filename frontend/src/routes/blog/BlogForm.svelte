<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '$lib/components/Button.svelte';
	import { page } from '$app/state';
	import { auth } from '$lib/stores/auth';

	let form = $derived(page.form);
</script>

<div>
	<form method="POST" action="?/createArticle" use:enhance>
		{#if form?.error}
			<div class="mb-3 rounded bg-red-50 p-3 text-red-600">{form.error}</div>
		{/if}

		{#if form?.success}
			<div class="mb-3 rounded bg-green-50 p-3 text-green-600">Article created successfully!</div>
		{/if}

		<input type="hidden" name="token" value={$auth.token || ''} />

		<input
			type="text"
			name="title"
			class="mb-3 w-full rounded-md border-2 border-gray-300 p-2"
			placeholder="Article title..."
			required
		/>
		<textarea
			name="body"
			class="mb-3 w-full rounded-md border-2 border-gray-300 p-2"
			placeholder="Write your article here..."
			rows="10"
			required
		></textarea>
		<Button label="Submit Article" type="submit" theme="primary" />
	</form>
</div>
