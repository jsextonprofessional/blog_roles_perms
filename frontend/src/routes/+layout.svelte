<!-- frontend/src/routes/+layout.svelte -->
<script lang="ts">
	import '../app.css';
	import { auth, logout } from '$lib/stores/auth';
	import { page } from '$app/state';

	$: user = $auth.user;
</script>

<header class="bg-gray-900 text-white shadow-lg">
	<nav class="mx-auto flex max-w-6xl items-center justify-between p-4">
		<a href="/" class="text-2xl font-bold hover:text-gray-300">Blog App</a>

		<div class="flex items-center gap-8 text-lg">
			{#if user}
				<span class="font-medium">
					{user.firstName}
					<span class="rounded bg-blue-600 px-2 py-1 text-sm">({user.role})</span>
				</span>
				<button on:click={logout} class="hover:underline"> Logout </button>
			{:else}
				<a href="/login" class:underline={page.url.pathname === '/login'} class="hover:underline">
					Login
				</a>
			{/if}
		</div>
	</nav>
</header>

<main class="min-h-screen bg-gray-50">
	<slot />
</main>
