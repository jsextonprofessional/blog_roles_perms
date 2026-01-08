<script lang="ts">
	let { id, postId, authorId, body, createdAt, updatedAt } = $props();
</script>

<div class="comment-body my-2 rounded-md border-2 border-blue-500 p-4">
	<p>{body}</p>
	<p>Posted on {new Date(createdAt).toLocaleDateString()}</p>
</div>
