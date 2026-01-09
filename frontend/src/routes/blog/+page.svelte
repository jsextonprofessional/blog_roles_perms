<script lang="ts">
	import BlogBody from './BlogBody.svelte';
	import { blogPosts, comments } from '$lib/dummyData';
	import BlogForm from './BlogForm.svelte';
	import type { PageData } from '../$types';

	let { data, form }: PageData = $props();
</script>

<div class="flex flex-row border-2 border-yellow-500">
	<div class="flex basis-2/3 flex-col">
		{#each blogPosts as post}
			<BlogBody
				title={post.title}
				body={post.body}
				comments={comments.filter((comment) => comment.postId === post.id)}
			/>
		{/each}
	</div>
	<div class="flex basis-1/3 flex-col">
		<BlogForm {form} body="Write your blog post here..." />
	</div>
</div>
