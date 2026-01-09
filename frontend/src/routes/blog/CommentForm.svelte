<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '$lib/components/Button.svelte';
	import { page } from '$app/state';

	let form = $derived(page.form);

	let { content } = $props();
</script>

<div>
	<form method="POST" action="?/submitComment" use:enhance>
		{#if form?.error}
			<div class="rounded bg-red-50 p-3 text-red-600">{form.error}</div>
		{/if}

		<textarea
			name="content"
			class="w-full rounded-md border-2 border-gray-300 p-2"
			bind:value={content}
			placeholder="Write your comment here..."
			rows="5"
		></textarea>

		<Button label="Submit Comment" type="submit" />
	</form>
</div>
