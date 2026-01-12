<script lang="ts">
	let { type, label, formAction = undefined, theme } = $props();

  type ButtonTheme = {
    [key: string]: string;
  };

  const themes: ButtonTheme = {
    primary: 'bg-blue-500 hover:bg-blue-600',
    warning: 'bg-yellow-500 hover:bg-yellow-600',
    danger: 'bg-red-500 hover:bg-red-600',
  };
</script>

<!-- formAction is optional prop. it's use case would be if you need to override the form's action attribute. ie if form's action="?/submitComment", button's formAction="?/submitCommentAlternateRoute" (go somewhere besides default route) can be left out when mounted on parent. VERY COOL. -->
<button
	{type}
	formaction={formAction}
	class={`rounded-md px-4 py-2 text-white ${themes[theme] || themes.primary}`}
>
	{label}
</button>
