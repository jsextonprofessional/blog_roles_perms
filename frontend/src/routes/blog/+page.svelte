<script lang="ts">
	import BlogBody from './BlogBody.svelte';
	import { blogPosts, comments } from '$lib/dummyData';
</script>

{#each blogPosts as post}
	<BlogBody
		title={post.title}
		body={post.body}
		comments={comments.filter((comment) => comment.postId === post.id)}
	/>
{/each}
