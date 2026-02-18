<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '$lib/components/Button.svelte';
	import { page } from '$app/state';

	let form = $derived(page.form);
</script>

<div>
	<form method="POST" action="?/submitBlog" use:enhance>
		{#if form?.error}
			<div class="rounded bg-red-50 p-3 text-red-600">{form.error}</div>
		{/if}

		<!-- name attribute is necessary for form submission. binds to server action. -->

    <input
      type="text"
      name="title"
      class="w-full rounded-md border-2 border-gray-300 p-2"
      placeholder="Write your title here..."
    />
		<textarea
			name="body"
			class="w-full rounded-md border-2 border-gray-300 p-2"
			placeholder="Write your blurb here..."
			rows="10"
		></textarea>
		<Button label="Submit Post bespoke" type="submit" theme="primary" />
	</form>
</div>
