<script lang="ts">
  import { onMount } from 'svelte';
  import { PUBLIC_APP_URL } from '$env/static/public';
  import {
    generateDeckJumpLink,
    generatePlaylistJumpLink,
    type ResourceSourceType,
  } from '$lib/utils';

  interface Deck {
    refId: string;
    name: string;
  }

  interface Playlist {
    refId: string;
    name: string;
  }

  let resourceType = 'deck';
  let sourceType: ResourceSourceType = 'preloaded';
  let selectedResourceId = '';
  let skipTutorial = true;
  let generatedLink = '';
  let copiedToClipboard = false;

  let preloadedDecks: Deck[] = [];
  let preloadedPlaylists: Playlist[] = [];
  let libraryPlaylists: Playlist[] = [];
  let loading = true;

  onMount(async () => {
    try {
      // Fetch all resources
      const [decksResponse, preloadedPlaylistsResponse, libraryPlaylistsResponse] = await Promise.all([
        fetch('/api/decks/preloaded'),
        fetch('/api/playlists/preloaded'),
        fetch('/api/playlists/library'),
      ]);

      preloadedDecks = await decksResponse.json();
      preloadedPlaylists = await preloadedPlaylistsResponse.json();
      libraryPlaylists = await libraryPlaylistsResponse.json();
    } catch (error) {
      console.error('Failed to fetch resources:', error);
    } finally {
      loading = false;
    }
  });

  $: availableResources = (() => {
    if (resourceType === 'deck') {
      // Only preloaded decks for now
      return preloadedDecks;
    } else {
      // Playlists can be from preloaded or library
      if (sourceType === 'preloaded') {
        return preloadedPlaylists;
      } else {
        return libraryPlaylists;
      }
    }
  })();

  $: {
    // Generate link when selection changes
    if (selectedResourceId) {
      if (resourceType === 'deck') {
        generatedLink = generateDeckJumpLink(selectedResourceId, PUBLIC_APP_URL, skipTutorial);
      } else {
        generatedLink = generatePlaylistJumpLink(selectedResourceId, PUBLIC_APP_URL);
      }
    } else {
      generatedLink = '';
    }
    copiedToClipboard = false;
  }

  async function copyToClipboard() {
    try {
      await navigator.clipboard.writeText(generatedLink);
      copiedToClipboard = true;
      setTimeout(() => {
        copiedToClipboard = false;
      }, 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  }

  function handleResourceTypeChange() {
    selectedResourceId = '';
    generatedLink = '';
    // Reset source type to preloaded when switching to deck
    if (resourceType === 'deck') {
      sourceType = 'preloaded';
    }
  }

  function handleSourceTypeChange() {
    selectedResourceId = '';
    generatedLink = '';
  }
</script>

<div class="paper">
  <h2>Jump Scene Link Generator</h2>

  {#if loading}
    <p style="text-align: center;">Loading resources...</p>
  {:else}
    <div class="form-group">
      <h3 class="h3 font-bold">Resource Type</h3>
      <div class="radio-group">
        <label>
          <input type="radio" bind:group={resourceType} value="deck" on:change={handleResourceTypeChange} />
          Deck
        </label>
        <label>
          <input type="radio" bind:group={resourceType} value="playlist" on:change={handleResourceTypeChange} />
          Playlist
        </label>
      </div>
    </div>

    <div class="form-group">
      <label for="source-type">Source Type</label>
      <select id="source-type" bind:value={sourceType} on:change={handleSourceTypeChange} disabled={resourceType === 'deck'}>
        <option value="preloaded">Public (Preloaded)</option>
        {#if resourceType === 'playlist'}
          <option value="library">Library (Pro)</option>
        {/if}
      </select>
    </div>

    <div class="form-group">
      <label for="resource-select">Select {resourceType === 'deck' ? 'Deck' : 'Playlist'}</label>
      <select id="resource-select" bind:value={selectedResourceId}>
        <option value="">-- Select a {resourceType} --</option>
        {#each availableResources as resource}
          <option value={resource.refId}>{resource.name}</option>
        {/each}
      </select>
    </div>

    {#if resourceType === 'deck'}
      <div class="form-group">
        <label>
          <input type="checkbox" bind:checked={skipTutorial} />
          Skip Tutorial
        </label>
      </div>
    {/if}

    {#if generatedLink}
      <div class="form-group">
        <label for="generated-link">Generated Link</label>
        <div class="link-display">
          <input id="generated-link" type="text" readonly value={generatedLink} />
          <button class="btn btn-small btn-green" on:click={copyToClipboard}>
            {copiedToClipboard ? 'Copied!' : 'Copy'}
          </button>
        </div>
      </div>
    {/if}
  {/if}
</div>

<style>
  .paper {
    min-width: 20rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    box-sizing: content-box;
  }

  .paper h2 {
    text-align: center;
    margin-bottom: 1rem;
  }

  .form-group {
    margin-bottom: 1rem;
  }

  .form-group label {
    display: block;
    font-weight: bold;
    margin-bottom: 0.5rem;
  }

  .radio-group {
    display: flex;
    gap: 1rem;
  }

  .radio-group label {
    font-weight: normal;
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }

  select,
  input[type='text'] {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box;
  }

  .link-display {
    display: flex;
    gap: 0.5rem;
  }

  .link-display input {
    flex: 1;
  }

  .link-display button {
    flex-shrink: 0;
    min-width: 80px;
  }
</style>
