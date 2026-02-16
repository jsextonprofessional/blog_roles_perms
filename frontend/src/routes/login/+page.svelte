<script lang="ts">
	import { goto } from '$app/navigation';
	import Button from '$lib/components/Button.svelte';
	import { loginWithEmail } from '$lib/auth/auth.api';
	import { AuthError } from '$lib/auth/errors';

	let email = '';
	let password = '';
	let loading = false;
	let error = '';

	async function handleLogin() {
		loading = true;
		error = '';

		try {
			await loginWithEmail(email, password);
			goto('/');
		} catch (err: any) {
			if (err instanceof AuthError) {
				if (err.code === 'INVALID_CREDENTIALS') {
					error = 'Invalid email or password. Please try again.';
				} else if (err.code === 'NETWORK') {
					error = 'Cannot reach the server. Check your internet connection.';
				} else {
					error = err.message || 'Login failed. Please try again.';
				}
			} else {
				error = 'Something went wrong. Please try again later.';
			}
		} finally {
			loading = false;
		}
	}
</script>

<div class="mx-auto mt-20 max-w-md rounded-lg bg-white p-8 shadow-lg">
	<h1 class="mb-8 text-center text-3xl font-bold">Login to Blog App</h1>

	{#if error}
		<div class="mb-6 rounded border border-red-400 bg-red-100 p-4 text-red-700">
			{error}
		</div>
	{/if}

	<form on:submit|preventDefault={handleLogin} class="space-y-6">
		<div>
			<label for="email" class="mb-2 block text-sm font-medium">Email</label>
			<input
				id="email"
				type="email"
				bind:value={email}
				required
				class="w-full rounded-md border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
				placeholder="admin@example.com"
			/>
		</div>

		<div>
			<label for="password" class="mb-2 block text-sm font-medium">Password</label>
			<input
				id="password"
				type="password"
				bind:value={password}
				required
				class="w-full rounded-md border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
				placeholder="supersecret"
			/>
		</div>

		<button
			type="submit"
			disabled={loading}
			class="w-full rounded-md bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
		>
			{loading ? 'Logging in...' : 'Login'}
		</button>

		<p class="mt-6 text-center text-sm text-gray-600">
			Demo credentials: <strong>admin@example.com</strong> / <strong>supersecret</strong>
		</p>
	</form>
	<div class="mt-6 text-center text-sm text-gray-600">
		Don't have an account? Click below to register.
	</div>
	<Button type="button" label="Register" theme="primary" onclick={() => goto('/register')} />
</div>
