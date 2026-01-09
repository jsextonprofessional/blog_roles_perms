<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '$lib/components/Button.svelte';

	import type { PageData } from '../$types';

	let { form }: PageData = $props();

	let body = $state('');
</script>

<div>
	<form method="POST" action="?/submitBlog" use:enhance>
		{#if form?.error}
			<div class="rounded bg-red-50 p-3 text-red-600">{form.error}</div>
		{/if}

		<!-- name attribute is necessary for form submission. binds to server action. -->
		<textarea
			name="body"
			class="w-full rounded-md border-2 border-gray-300 p-2"
			bind:value={body}
			placeholder="Write your blurb here..."
			rows="10"
		></textarea>
		<Button label="Submit Post bespoke" type="submit" />
	</form>
</div>
