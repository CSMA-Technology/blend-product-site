<script lang="ts">
  import AuthCheck from '$lib/components/AuthCheck.svelte';
  import { user } from '$lib/firebase';
  import { goto } from '$app/navigation';
  import { getAuth, updatePassword, linkWithCredential, EmailAuthProvider, unlink } from 'firebase/auth';

  let password = '';
  let confirmPassword = '';
  let errorMsg = '';
  let submitting = false;

  $: email = $user?.email ?? '';

  // Redirect if already using email/password provider
  $: if ($user?.providerData?.some((p) => p.providerId === 'password')) {
    goto('/account');
  }

  async function handleSubmit(e: Event) {
    e.preventDefault();
    errorMsg = '';
    if (password !== confirmPassword) {
      errorMsg = 'Passwords do not match.';
      return;
    }
    submitting = true;
    try {
      const auth = getAuth();
      const currentUser = auth.currentUser;
      if (!currentUser) {
        errorMsg = 'No user is currently logged in.';
        submitting = false;
        return;
      }
      // As of 7/30/2025, linking to a new email/password provider with a credential is bugged if the user has a Google provider.
      // Instead, we update the password directly and unlink the Google provider.
      // Updating password will create an email/password provider if it doesn't exist
      await updatePassword(currentUser, password);
      await unlink(currentUser, 'google.com'); // Unlink Google provider if needed
      alert('Authentication method switched successfully. Please log in again.');
      goto('/account');
    } catch (err: any) {
      errorMsg = err?.message || 'Failed to switch authentication method.';
    } finally {
      submitting = false;
    }
  }
</script>

<AuthCheck />

<div class="mx-auto mt-10 max-w-lg rounded bg-white p-6 shadow">
  <h2 class="mb-4 text-xl font-bold">Switch to Email & Password Login</h2>
  <p class="mb-4">You are currently logged in with Google. To switch to an email/password login, please enter your new password below.</p>
  <form on:submit|preventDefault={handleSubmit}>
    <div class="mb-4">
      <label for="email" class="mb-1 block text-sm font-medium">Email</label>
      <input id="email" type="email" class="w-full rounded border bg-gray-100 px-3 py-2" value={email} readonly />
    </div>
    <div class="mb-4">
      <label for="new-password" class="mb-1 block text-sm font-medium">New Password</label>
      <input id="new-password" type="password" class="w-full rounded border px-3 py-2" bind:value={password} required minlength="6" />
    </div>
    <div class="mb-4">
      <label for="confirm-password" class="mb-1 block text-sm font-medium">Confirm Password</label>
      <input id="confirm-password" type="password" class="w-full rounded border px-3 py-2" bind:value={confirmPassword} required minlength="6" />
    </div>
    {#if errorMsg}
      <div class="mb-4 text-red-600">{errorMsg}</div>
    {/if}
    <button type="submit" class="btn btn-green !mx-auto" disabled={submitting}>Submit</button>
  </form>
</div>
