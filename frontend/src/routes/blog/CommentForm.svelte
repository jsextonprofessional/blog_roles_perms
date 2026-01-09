<script lang="ts">
	let { body } = $props();
</script>

<textarea
	class="w-full rounded-md border-2 border-gray-300 p-2"
	bind:value={body}
	placeholder="Write your comment here..."
	rows="5"
></textarea>
