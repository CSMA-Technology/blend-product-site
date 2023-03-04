<script lang="ts">
    import { user, signOut } from '$lib/firebase';
</script>

<h1>Blend: The Orton-Gillingham method made easy</h1>
{#if $user}
    <p>Welcome back, {$user.displayName}</p>
    <button on:click={signOut}>Sign out</button>
    <h3>Available Pages:</h3>
    <a href={`/account/${$user.uid}`}>Account Management</a>
{:else}
    <p>Welcome, new user! Make an account or log in <a href="/login">here</a></p>
{/if}

<style>
    button {
        max-width: 100px;
    }
</style>