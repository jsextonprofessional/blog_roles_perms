<script lang="ts">
	import { apiFetch } from '$lib/api';
	import { login } from '$lib/stores/auth';
	import { goto } from '$app/navigation';
	import { loginWithEmail } from '$lib/auth/auth.mutations';

	let email = '';
	let password = '';
	let loading = false;
	let error = '';

	async function handleRegistration() {
		loading = true;
		error = '';

		try {
			await apiFetch('register', {
				method: 'POST',
				body: JSON.stringify({ email, password })
			});

			await loginWithEmail(email, password);
			goto('/');
		} catch (err: any) {
			error = err.message || 'Registration failed. Please try again.';
		} finally {
			loading = false;
		}
	}
</script>

<div class="mx-auto mt-20 max-w-md rounded-lg bg-white p-8 shadow-lg">
	<h1 class="mb-8 text-center text-3xl font-bold">Register for Blog App</h1>

	{#if error}
		<div class="mb-6 rounded border border-red-400 bg-red-100 p-4 text-red-700">
			{error}
		</div>
	{/if}

	<form on:submit|preventDefault={handleRegistration} class="space-y-6">
		<div>
			<label for="email" class="mb-2 block text-sm font-medium">Email</label>
			<input
				id="email"
				type="email"
				bind:value={email}
				required
				class="w-full rounded-md border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
				placeholder="user@example.com"
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
			{loading ? 'Working on it...' : 'Register'}
		</button>
	</form>
</div>
