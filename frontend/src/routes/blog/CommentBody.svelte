<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import { auth } from '$lib/stores/auth';

	let { id, articleId, authorId, content, createdAt, updatedAt } = $props();
</script>

<div class="comment-body my-2 rounded-md border-2 border-blue-500 p-4">
	<p>content{content}</p>
	<p>Comment ID: {id}</p>
	<p>Post ID: {articleId}</p>
	<p>Author ID: {authorId}</p>
	<p>Posted on {new Date(createdAt).toLocaleDateString()}</p>
	<p>Last updated on {new Date(updatedAt).toLocaleDateString()}</p>

	<div class="flex flex-row gap-4">
		{#if $auth.user && $auth.user.id === authorId}
			<Button label="Edit Comment" type="button" theme="warning" />
		{/if}
		{#if $auth.user && ($auth.user.id === authorId || $auth.user.role === 'ADMIN')}
			<form method="POST" action="?/deleteComment">
				<input type="hidden" name="commentId" value={id} />
				<input type="hidden" name="token" value={$auth.token || ''} />

				<Button label="Delete Comment" type="submit" theme="danger" />
			</form>
		{/if}
	</div>
</div>
