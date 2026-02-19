<script lang="ts">
	import BlogBody from './BlogBody.svelte';
	import BlogForm from './BlogForm.svelte';
	import { auth } from '$lib/stores/auth';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<!-- Debug helpers (remove later) -->
<div class="mt-8 text-sm text-gray-500">
	Debug: {$auth.user ? `Logged in ${JSON.stringify($auth.user)}` : 'Not logged in'}
</div>

<div class="flex flex-row gap-4 border-2 border-yellow-500 p-4">
	<div class={`flex flex-col ${$auth.user ? 'basis-2/3' : 'basis-full'} justify-between`}>
		{#if data.articles.length === 0}
			<p class="text-gray-500">No articles yet.</p>
		{:else}
			{#each data.articles as article}
				<BlogBody
					articleId={article.id}
					authorId={article.authorId}
					title={article.title}
					body={article.content}
					comments={article.comments || []}
				/>
			{/each}
		{/if}
	</div>
	{#if $auth.user}
		<div class="flex basis-1/3 flex-col">
			<BlogForm />
		</div>
	{/if}
</div>
