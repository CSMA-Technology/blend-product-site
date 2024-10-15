<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { customLoginToken } from '$lib/firebase';

  const redirectParam = $page.url.searchParams.get('successRedirect');
  const selectBasic = async () => {
    if (redirectParam && (redirectParam === 'app' || redirectParam === 'previewApp')) {
      const appUrl = redirectParam === 'app' ? 'https://app.blendreading.com' : 'https://preview-app.blendreading.com';
      const url = `${appUrl}?jumpScene=${encodeURIComponent($page.url.searchParams.get('jumpScene') || 'none')}${
        $customLoginToken ? `&loginToken=${encodeURIComponent($customLoginToken)}` : ''
      }`;
      window.location.replace(url);
    } else {
      goto('/account');
    }
  };

  let billingCycle = 'yearly';

  const selectPro = () => {
    gtag('event', 'choose_pro');
    goto(`/account${$page.url.search || '?'}&action=upgrade${billingCycle === 'yearly' ? '&subscriptionType=yearly' : ''}`);
  };
</script>

<svelte:head>Choose Plan - Blend</svelte:head>

<div class="content">
  <h1 class="mt-4">Choose your plan</h1>
  <div class="my-2 flex flex-col">
    <div class="flex justify-center">
      <div class="switch mb-1 w-[26rem]">
        <button class={billingCycle === 'monthly' ? 'active' : ''} on:click={() => (billingCycle = 'monthly')}><p class="text-lg">Monthly</p></button>
        <button class={billingCycle === 'yearly' ? 'active' : ''} on:click={() => (billingCycle = 'yearly')}
          ><div class="flex items-center justify-center gap-x-3">
            <p class="text-lg">Yearly</p>
            <div class="rounded-lg bg-[#ff5c5c] px-2 py-1 text-sm text-white shadow">Save 20%</div>
          </div></button>
      </div>
    </div>
    {#if billingCycle === 'monthly'}
      <h1 class="text-2xl">Save 20% by paying yearly!</h1>
    {/if}
  </div>
  <div class="side-by-side">
    <div class="plan">
      <div class="header basic">
        <h2>Basic</h2>
      </div>
      <div class="features">
        <h2>Free forever</h2>
        <ul>
          <li>Virtual Blending Board</li>
          <li>Preloaded Decks</li>
          <li>One (1) Custom Deck</li>
          <li>Preloaded Playlists</li>
          <li>One (1) Custom Playlist</li>
        </ul>
        <p><br /></p>
        <button class="btn basic" on:click={selectBasic}><h3>Choose Basic</h3></button>
      </div>
    </div>
    <div class="plan">
      <div class="header pro">
        <h2>Blend Pro</h2>
        <p>Basic features included</p>
      </div>
      <div class="features">
        {@html billingCycle === 'monthly'
          ? '<h2>$10 / month</h2>'
          : `<div class="flex items-center justify-center gap-x-2"><h2 class="mb-0">$8 / month</h2><p class="mt-0 text-md">($96 / year)</p></div>`}
        <ul>
          <li>Unlimited Decks & Playlists</li>
          <li>Word Mats</li>
          <li>Themes</li>
          <li>Access to the Blend Library</li>
          <li>Resource Sharing</li>
        </ul>
        <p>Get 7 days free when you try Pro!</p>
        <button class="btn pro" on:click={selectPro}><h3>Choose Pro</h3></button>
      </div>
    </div>
  </div>
</div>

<style>
  .switch {
    display: flex;
    border-radius: 10px;
    border: 2px solid #006d74;
    overflow: hidden;
    box-shadow: 0px 2px 2px 0px rgba(0, 0, 0, 0.25);
  }

  .switch button {
    flex: 1;
    padding: 0.5rem 2rem;
    cursor: pointer;
    border: none;
    background: rgba(255, 255, 255, 0.35);
    color: #006d74;
    font-size: 16px;
    font-weight: bold;
    transition:
      background-color 0.3s,
      color 0.3s;
  }

  .switch button:hover {
    background: rgba(255, 255, 255, 0.3);
    filter: brightness(1.1);
  }

  .switch button.active {
    background-color: #006d74;
    color: white;
  }

  .features {
    padding: 1rem;
    border-radius: 0 0 10px 10px;
    display: flex;
    flex-direction: column;
  }
  .side-by-side {
    width: 70%;
  }
  .plan {
    margin: 1rem;
    width: 24rem;
    border-radius: 10px;
    box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
    background: rgba(255, 255, 255, 0.35);
  }
  .header {
    border-radius: 10px 10px 0 0;
    padding: 0 1rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .basic {
    color: white;
    background-color: #3b2e86 !important;
    border: none;
    box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
  }

  .pro:hover {
    color: black;
  }

  .pro {
    color: black;
    background: linear-gradient(52.71deg, #fffaa0 -7.68%, #f4ba9e 41.11%, #eea7fa 91.67%) !important;
    border: none;
    box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
  }

  ul {
    list-style-type: none;
    padding: 0;
    margin: 0;
  }

  li {
    background: white;
    border: 2px solid black;
    border-radius: 5px;
    margin: 0.7rem;
    box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
    padding: 0.8rem;
  }
  @media (max-width: 480px) {
    .side-by-side {
      width: 100%;
    }
  }
</style>
