<script lang="ts">
	import CommentBody from './CommentBody.svelte';
	import CommentForm from './CommentForm.svelte';
	import { auth } from '$lib/stores/auth';
	import Button from '$lib/components/Button.svelte';
	import { Role } from '$lib/types';

	let { title, body, comments, articleId, authorId } = $props();
</script>

<div class="my-4 rounded-md border-2 border-pink-500 p-4">
	<div class="flex flex-row">
		<div class="flex flex-col">
			<h1>{title}</h1>
			<div>{@html body}</div>
		</div>
		<div class="flex flex-row justify-end gap-4">
			{#if $auth.user && $auth.user.id === authorId}
				<Button label="Edit Post" type="button" theme="warning" />
			{/if}
			{#if $auth.user && ($auth.user.id === authorId || $auth.user.role === Role.ADMIN)}
				<Button label="Delete Post" type="button" theme="danger" />
			{/if}
		</div>
	</div>

	{#if $auth.user}
		<div>
			{#each comments as comment}
				<CommentBody
					id={comment.id}
					articleId={comment.articleId}
					authorId={comment.authorId}
					content={comment.content}
					createdAt={comment.createdAt}
					updatedAt={comment.updatedAt}
				/>
			{/each}

			<CommentForm {articleId} token={$auth.token || ''} />
		</div>
	{/if}
</div>
