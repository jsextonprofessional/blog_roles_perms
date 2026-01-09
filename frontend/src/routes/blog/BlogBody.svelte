<script lang="ts">
	import CommentBody from './CommentBody.svelte';
	import CommentForm from './CommentForm.svelte';

	let { title, body, comments } = $props();
</script>

<div class="my-4 rounded-md border-2 border-pink-500 p-4">
	<h1>{title}</h1>
	<div>{@html body}</div>

	<!-- if USER -->
	<div>
		{#each comments as comment}
			<CommentBody
				id={comment.id}
				postId={comment.postId}
				authorId={comment.authorId}
				body={comment.body}
				createdAt={comment.createdAt}
				updatedAt={comment.updatedAt}
			/>
		{/each}

		<CommentForm content="Write your comment here..." />
	</div>
</div>
