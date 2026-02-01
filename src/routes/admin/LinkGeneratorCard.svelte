<script lang="ts">
  import { onMount } from 'svelte';
  import { PUBLIC_APP_URL } from '$env/static/public';
  import {
    generateDeckJumpLink,
    generatePlaylistJumpLink,
    generateWordMatJumpLink,
    WORD_MATS,
    type ResourceSourceType,
  } from '$lib/utils';

  type ResourceType = 'deck' | 'playlist' | 'wordMat';

  interface Deck {
    refId: string;
    name: string;
  }

  interface Playlist {
    refId: string;
    name: string;
  }

  let resourceType: ResourceType = 'deck';
  let sourceType: ResourceSourceType = 'preloaded';
  let selectedResourceId = '';
  let customWordMatId = '';
  let useCustomWordMatId = false;
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
      return preloadedDecks;
    } else if (resourceType === 'playlist') {
      if (sourceType === 'preloaded') {
        return preloadedPlaylists;
      } else {
        return libraryPlaylists;
      }
    }
    return [];
  })();

  $: effectiveWordMatId = useCustomWordMatId ? customWordMatId : selectedResourceId;

  $: {
    // Generate link when selection changes
    if (resourceType === 'wordMat') {
      if (effectiveWordMatId) {
        generatedLink = generateWordMatJumpLink(effectiveWordMatId, PUBLIC_APP_URL);
      } else {
        generatedLink = '';
      }
    } else if (selectedResourceId) {
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
    customWordMatId = '';
    useCustomWordMatId = false;
    generatedLink = '';
    // Reset source type to preloaded when switching to deck or word mat
    if (resourceType === 'deck' || resourceType === 'wordMat') {
      sourceType = 'preloaded';
    }
  }

  function handleSourceTypeChange() {
    selectedResourceId = '';
    generatedLink = '';
  }

  function handleWordMatSelectChange() {
    if (selectedResourceId === 'other') {
      useCustomWordMatId = true;
      selectedResourceId = '';
    } else {
      useCustomWordMatId = false;
      customWordMatId = '';
    }
  }
</script>

<div class="paper">
  <h2>Jump Scene Link Generator</h2>

  {#if loading}
    <p style="text-align: center;">Loading resources...</p>
  {:else}
    <div class="form-group">
      <label>Resource Type</label>
      <div class="radio-group">
        <label>
          <input type="radio" bind:group={resourceType} value="deck" on:change={handleResourceTypeChange} />
          Deck
        </label>
        <label>
          <input type="radio" bind:group={resourceType} value="playlist" on:change={handleResourceTypeChange} />
          Playlist
        </label>
        <label>
          <input type="radio" bind:group={resourceType} value="wordMat" on:change={handleResourceTypeChange} />
          Word Mat
        </label>
      </div>
    </div>

    {#if resourceType !== 'wordMat'}
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
    {:else}
      <div class="form-group">
        <label for="wordmat-select">Select Word Mat</label>
        <select id="wordmat-select" bind:value={selectedResourceId} on:change={handleWordMatSelectChange}>
          <option value="">-- Select a word mat --</option>
          {#each WORD_MATS as wordMat}
            <option value={wordMat.id}>{wordMat.name}</option>
          {/each}
          <option value="other">Other (enter ID manually)</option>
        </select>
      </div>

      {#if useCustomWordMatId}
        <div class="form-group">
          <label for="custom-wordmat-id">Word Mat ID</label>
          <input id="custom-wordmat-id" type="text" bind:value={customWordMatId} placeholder="Enter word mat ID" />
        </div>
      {/if}

      <p class="info-text">Word mats are public and accessible to all users without login.</p>
    {/if}

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

  .info-text {
    font-size: 0.875rem;
    color: #666;
    font-style: italic;
    margin-top: 0;
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
