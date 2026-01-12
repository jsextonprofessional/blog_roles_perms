<script lang="ts">
	import CommentBody from './CommentBody.svelte';
	import CommentForm from './CommentForm.svelte';
  import { auth } from '$lib/stores/auth';
	import Button from '$lib/components/Button.svelte';

	let { title, body, comments, postId, authorId } = $props();
</script>

<div class="my-4 rounded-md border-2 border-pink-500 p-4">
	<div class="flex flex-row">
    <div class="flex flex-col">
      <h1>{title}</h1>
      <div>{@html body}</div>
    </div>
    {#if $auth.user && $auth.user.id === authorId}
    <div class="flex flex-row gap-4 justify-end">
      <Button label="Edit Post" type="button" theme="warning" />
      <Button label="Delete Post" type="button" theme="danger" />
    </div>
    {/if}
  </div>

  {#if $auth.user}
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

      <CommentForm />
    </div>
  {/if}
</div>
