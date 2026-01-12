<script lang="ts">
	import BlogBody from './BlogBody.svelte';
	import BlogForm from './BlogForm.svelte';
	import { blogPosts, comments } from '$lib/dummyData';
  import { auth } from '$lib/stores/auth';
</script>

<div class="flex flex-row border-2 border-yellow-500 gap-4 p-4">
	<div class={`flex flex-col ${$auth.user ? 'basis-2/3' : 'basis-full'} justify-between`}>
		{#each blogPosts as post}
      <BlogBody
        title={post.title}
        body={post.body}
        comments={comments.filter(c => c.postId === post.id)}
      />
		{/each}
	</div>
  {#if $auth.user}
	<div class="flex basis-1/3 flex-col">
		<BlogForm />
	</div>
  {/if}
</div>

<!-- Debug helpers (remove later) -->
<div class="mt-8 text-sm text-gray-500">
  Debug: {$auth.user ? 'Logged in' : 'Not logged in'}
</div>
