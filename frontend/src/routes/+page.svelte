<script lang="ts">
	import { auth } from '$lib/stores/auth';
	$: user = $auth.user;
</script>

<div class="mx-auto mt-10 max-w-4xl">
	<div>Is user logged in? → {$auth.user ? 'YES' : 'NO'}</div>
	<div>Current user object: {JSON.stringify($auth.user ?? 'null')}</div>
	<h1 class="mb-6 text-4xl font-bold">Welcome to the Blog App</h1>

	{#if user}
		<div class="mb-8 rounded border border-green-400 bg-green-100 px-6 py-4 text-green-700">
			<p class="text-xl">
				You are logged in as <strong>{user.firstName} {user.lastName}</strong>
				({user.role}).
			</p>
			<p class="mt-2">
				Go to <a href="/login" class="underline">/login</a> to test logout or re-login.
			</p>
		</div>
	{:else}
		<div class="mb-8 rounded border border-yellow-400 bg-yellow-100 px-6 py-4 text-yellow-700">
			<p class="text-xl">You are not logged in.</p>
			<p class="mt-2"><a href="/login" class="font-bold underline">Go to Login →</a></p>
		</div>
	{/if}

	<p class="text-gray-600">Blog articles will appear here soon...</p>
</div>
