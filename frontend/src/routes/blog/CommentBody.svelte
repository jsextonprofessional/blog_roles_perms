<script lang="ts">
	import Button from "$lib/components/Button.svelte";
  import { auth } from '$lib/stores/auth';

	let { id, postId, authorId, body, createdAt, updatedAt } = $props();
</script>

<div class="comment-body my-2 rounded-md border-2 border-blue-500 p-4">
	<p>{body}</p>
  <p>Comment ID: {id}</p>
  <p>Post ID: {postId}</p>
  <p>Author ID: {authorId}</p>
	<p>Posted on {new Date(createdAt).toLocaleDateString()}</p>
  <p>Last updated on {new Date(updatedAt).toLocaleDateString()}</p>

  {#if $auth.user && $auth.user.id === authorId}
  <div class="flex flex-row gap-4">
    <Button label="Edit Comment" type="button" theme="warning" />
    <Button label="Delete Comment" type="button" theme="danger" />
  </div>
  {/if}
</div>
