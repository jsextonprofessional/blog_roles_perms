<script lang="ts">
  import { auth } from '$lib/stores/auth';
  $: user = $auth.user;
</script>

<div class="max-w-4xl mx-auto mt-10">
  <h1 class="text-4xl font-bold mb-6">Welcome to the Blog App</h1>

  {#if user}
    <div class="bg-green-100 border border-green-400 text-green-700 px-6 py-4 rounded mb-8">
      <p class="text-xl">You are logged in as <strong>{user.firstName} {user.lastName}</strong> ({user.permissionLevel})</p>
      <p class="mt-2">Go to <a href="/login" class="underline">/login</a> to test logout or re-login.</p>
    </div>
  {:else}
    <div class="bg-yellow-100 border border-yellow-400 text-yellow-700 px-6 py-4 rounded mb-8">
      <p class="text-xl">You are not logged in.</p>
      <p class="mt-2"><a href="/login" class="underline font-bold">Go to Login →</a></p>
    </div>
  {/if}

  <p class="text-gray-600">Blog articles will appear here soon...</p>
</div>

<!-- <style lang="postcss">
  @reference "tailwindcss";
</style> -->