<script lang="ts">
  import { user } from "$lib/firebase";
  import { enhance } from '$app/forms'
  import type { PageData } from "./$types";
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";
  export let data: PageData;

  let isPro = false;

  onMount( async () => {
    const idToken = await $user?.getIdToken();
    const userData = await fetch('/api/user', {
      headers: { 'Authorization':`Bearer ${idToken}`}
    });
    isPro = (await userData.json()).isSubscribedToBlendPro;
  });

</script>

<svelte:head>
  <title>Deck Import</title>
</svelte:head>

<div class="content">
  {#if isPro}
  <h1>Import Deck</h1>
    <form method="POST" use:enhance>
      <p>Would you like to add the deck <b><i>{`${data.deckName}`}</i></b> to your library?</p>
      <fieldset>
        <input type="hidden" name="uid" value={$user?.uid}/>
        <button formaction="?/decline" class="btn">No</button>
        <button formaction="?/accept" type="submit" class="btn btn-green">Yes</button>
      </fieldset>
    </form>
  {:else}
  <h1>This is a Blend Pro feature.</h1>
  <p>
    Importing from the Marketplace is available to Pro subscribers only.
    If you'd like to upgrade to Pro, you can do so from the account management page.
  </p>
  <button on:click={ () => goto('/account')} class="btn">Account Management</button>
  <button on:click={ () => goto('/marketplace') } class="btn">Back to Marketplace</button>
  {/if}
</div>

<style>
  .content {
    width: 50%;
  }
  button {
    font-size: large;
    font-weight: bold;
    margin-top: 0;
  }
  fieldset {
    margin-top: 1.5rem;
    border: none;
    padding: 0;
    display: flex;
    flex-wrap:wrap-reverse;
    justify-content:center;
  }
</style>