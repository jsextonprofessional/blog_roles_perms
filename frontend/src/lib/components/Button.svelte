<script lang="ts">
	let { type, label, formAction } = $props();
</script>

<button
	{type}
	formaction={formAction}
	class="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
>
	{label}
</button>
