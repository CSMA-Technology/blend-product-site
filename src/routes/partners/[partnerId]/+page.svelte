<script lang="ts">
  import { page } from '$app/stores';
  import type { PageData } from './$types.js';
  import { partnerData } from '$lib/utils.js';
  let { displayName, logoUrl, blendMessage, partnerMessage } = $page.data as PageData;

  const addPartnerCode = () => {
    $partnerData = { id: $page.params.partnerId, displayName };
  };
</script>

<div class="content p-4 pt-7">
  <div class="mt-4 flex w-full items-center justify-center gap-4 max-md:flex-col">
    {#if logoUrl}
      <div class="hidden w-32 md:block" />
    {/if}
    <h1>{displayName} + Blend</h1>
    {#if logoUrl}
      <img src={logoUrl} alt={`${displayName} logo`} class="w-32" />
    {/if}
  </div>
  <div class="my-4 max-w-3xl text-justify">
    <p>{blendMessage}</p>
    {#if partnerMessage}
      <h2 class="mt-4">A message from {displayName}:</h2>
      <p>{partnerMessage}</p>
    {/if}
  </div>
  <p>Click below to activate your special offer!</p>
  <button class="btn btn-green transition-all" disabled={!!$partnerData} on:click={addPartnerCode}
    >{$partnerData ? 'Activated ✅' : 'Activate'}</button>
  <p>You can browse the site to learn more about Blend, or get started with your Pro subscription!</p>
  <div class="flex">
    <a href="/" class="btn btn-purple">Learn More 📖</a>
    <!-- Not using the $upgradeUrl here because if you are on this page we want to make sure you include the partnerId even if you don't activate -->
    <a href={`/account?action=upgrade&partnerId=${$page.params.partnerId}`} class="btn btn-green">Go Pro ⚡</a>
  </div>
</div>

<style>
  .btn-green:disabled {
    color: white;
    border-color: white;
  }
</style>
