<script lang="ts">
  export let section: BlendLibrary.Section;
  export let scrollBy = 1;
  export let customOffset = 0;

  const paginationFactor = 320;
  const totalPaginationPixels = scrollBy * paginationFactor;

  $: offset = customOffset;
  $: atStart = offset === 0;
  $: atEnd = offset <= paginationFactor * (section.playlists.length - scrollBy) * -1;

  const move = (direction: number) => {
    if (direction > 0 && !atEnd) {
      offset -= totalPaginationPixels;
    } else if (direction < 0 && !atStart) {
      offset += totalPaginationPixels;
    }
  };
</script>

<div class="section-outer">
  <h2 class="title">{section.title}</h2>
  <p class="subtitle">{section.playlists.length} Playlists</p>
  <div class="section">
    <div class="items" style="transform: translateX({offset}px);">
      {#each section.playlists as playlist, i}
        <div class="item">
          <a href="/library/playlists/{playlist.slug}?offset={offset}">
            <img src={playlist.imagePath} alt="Playlist Preview" />
          </a>
          <h2 class="title">{playlist.name}</h2>
          <a href="/library/playlists/{playlist.slug}?offset={offset} " class="btn btn-blurple">More Info</a>
        </div>
      {/each}
    </div>
  </div>
  <div class="controls">
    <button class="page-btn" disabled={atStart} on:click={() => move(-1)}>&lsaquo; Prev</button>
    <button class="page-btn" disabled={atEnd} on:click={() => move(1)}>Next &rsaquo;</button>
  </div>
</div>

<style>
  .page-btn {
    background-color: #e0e6ff;
    color: black;
    border: none;
    border-radius: 5px;
    padding: 0.5rem 1rem;
    margin: 0.5rem;
    cursor: pointer;
    box-shadow: 0px 2px 2px 0px rgba(0, 0, 0, 0.25);
  }
  .page-btn:hover {
    filter: brightness(1.1);
  }
  .page-btn:disabled {
    background-color: #e6e6e6;
    color: #808080;
    filter: none;
    cursor: auto;
  }
  .section {
    width: 100%;
    overflow: hidden;
  }

  .section-outer {
    display: flex;
    flex-direction: column;
    align-items: center;
    border: black 2px solid;
    border-radius: 10px;
    padding: 2rem;
    margin: 1.5rem;
    width: 100%;
  }

  .items {
    display: flex;
    transition: transform 0.4s ease-in-out;
    transform: translateX(0px);
  }

  .item {
    display: flex;
    flex-direction: column;
    min-width: 16rem;
    height: 18rem;
    margin: 1rem;
    border-radius: 0.7rem;
    color: black;
    display: flex;
    justify-content: space-between;
    align-items: center;
    user-select: none;
    overflow: hidden;
    padding: 1rem;
    background: rgba(255, 255, 255, 0.5);
    border: 1px solid black;
    border-radius: 10px;
    box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
  }

  .item img {
    width: 16rem;
    min-height: 12rem;
    object-fit: cover;
    border-radius: 10px;
  }

  .title {
    font-family: 'Contrail One';
  }
  .subtitle {
    margin: 0;
  }

  .details {
    margin-top: 20px;
    font-style: italic;
    color: #9f9f9f;
  }

  @media (max-width: 768px) {
    .item {
      margin: 0.5rem;
      padding: 0.5rem;
    }
    .section {
      overflow: scroll;
    }
    .controls {
      display: none;
    }
  }
</style>
