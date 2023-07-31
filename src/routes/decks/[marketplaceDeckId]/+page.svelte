<script lang="ts">
  import { user, willAttemptLogin } from "$lib/firebase";
  import { enhance } from "$app/forms";
  import type { PageData } from "./$types";
  import { afterUpdate } from "svelte";
  import ProBadgeWrapper from "$lib/components/ProBadgeWrapper.svelte";
  import { goto } from "$app/navigation";
  export let data: PageData;

  $: {
    if (!$user && !willAttemptLogin()) goto(`/login?successRedirect=${encodeURIComponent(location.pathname)}`);
  }

  let isPro = false;
  let isLoading = true;

  afterUpdate(async () => {
    const idToken = await $user?.getIdToken();
    const userData = await fetch("/api/user", {
      headers: { Authorization: `Bearer ${idToken}` },
    });
    isPro = (await userData.json()).isSubscribedToBlendPro;
    isLoading = false;
  });
</script>

<svelte:head>
  <title>Deck Import</title>
</svelte:head>

<div class="content">
  <h1>Import Deck</h1>
  {#if isLoading}
  <h2>Loading...</h2>
  {:else}
  <form method="POST" use:enhance>
    <p>
      Would you like to add the deck <b><i>{`${data.deckName}`}</i></b> to your library?
    </p>
    <fieldset>
      <input type="hidden" name="uid" value={$user?.uid} />
      {#if isPro}
        <button formaction="?/accept" type="submit" class="btn btn-green"
          >Import</button
        >
      {:else}
        <ProBadgeWrapper>
          <!-- TODO: this should point to the new Blend Pro feature page -->
          <a href="/pricing" class="btn">Import</a>
        </ProBadgeWrapper>
      {/if}
    </fieldset>
  </form>
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
    flex-wrap: wrap-reverse;
    justify-content: center;
  }
  h2 {
    font-family: 'Contrail One';
  }
</style>
