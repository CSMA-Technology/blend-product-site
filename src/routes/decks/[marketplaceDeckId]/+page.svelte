<script lang="ts">
  import { user, willAttemptLogin } from "$lib/firebase";
  import { enhance } from "$app/forms";
  import type { PageData } from "./$types";
  import { onMount } from "svelte";
  import ProBadgeWrapper from "$lib/components/ProBadgeWrapper.svelte";
  import { goto } from "$app/navigation";
  export let data: PageData;

  $: {
    if (!$user && !willAttemptLogin())
      goto(`/login?successRedirect=${encodeURIComponent(location.pathname)}`);
  }

  let isPro = false;
  let isLoading = true;

  onMount(async () => {
    const idToken = await $user?.getIdToken();
    const userData = await fetch("/api/user", {
      headers: { Authorization: `Bearer ${idToken}` },
    });
    isPro = (await userData.json()).isSubscribedToBlendPro;
    isLoading = false;
  });
</script>

<svelte:head>
  <title>Import Deck</title>
</svelte:head>

<main>
  <div class="content">
    {#if isLoading}
      <h2 style="font-family: 'Contrail One'">Loading...</h2>
    {:else}
      <div class="side-by-side">
        <div class="info">
          <h1 style="margin-bottom: 0;">{data.deckMetadata.name}</h1>
          <p style="margin-top: 0;">Created by: {data.deckMetadata.author}</p>
          <p>{data.deckMetadata.description}</p>
        </div>
        <img src={data.deckMetadata.image} alt="deck letters" />
        {#if isPro}
        <form method="POST" use:enhance>
          <fieldset>
            <input type="hidden" name="uid" value={$user?.uid} />
            <button formaction="?/accept" type="submit" class="btn btn-green"
              >Import</button
            >
          </fieldset>
        </form>
      {:else}
        <ProBadgeWrapper>
          <a href="/" class="btn disabled">Import</a>
        </ProBadgeWrapper>
        <p>
          Importing from our Deck Library is available to Blend Pro users. You
          can upgrade or try Blend Pro one month free on the <a href="/account"
            >Account Management</a
          > page.
        </p>
      {/if}
      </div>
    {/if}
  </div>
</main>

<style>
  .side-by-side {
    margin: 2rem;
    padding: 1rem;
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.15);
  }
  a:hover {
    color: white;
  }
  main {
    /* padding: 2rem;
    background: linear-gradient(53deg, #FFFAA0 11.98%, #F4BA9E 55.21%, #EEA7FA 100%); */
  }
  img {
    width: 90%;
    border-radius: 10px;
  }
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
</style>
