<script lang="ts">
	let { type, label, formAction = undefined } = $props();
</script>

<!-- formAction is optional prop. it's use case would be if you need to override the form's action attribute. ie if form's action="?/submitComment", button's formAction="?/submitCommentAlternateRoute". can be left out when mounted on parent. VERY COOL. -->
<button
	{type}
	formaction={formAction}
	class="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
>
	{label}
</button>
