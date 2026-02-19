<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '$lib/components/Button.svelte';
	import { page } from '$app/state';

	let { articleId, token } = $props();
	let form = $derived(page.form);
</script>

<div>
	<form method="POST" action="?/createComment" use:enhance>
		{#if form?.error}
			<div class="rounded bg-red-50 p-3 text-red-600">{form.error}</div>
		{/if}

		<input type="hidden" name="articleId" value={articleId} />
		<input type="hidden" name="token" value={token} />

		<textarea
			name="content"
			class="w-full rounded-md border-2 border-gray-300 p-2"
			placeholder="this is a placeholder for comment..."
		></textarea>

		<Button label="Submit Comment" type="submit" theme="primary" />
	</form>
</div>
